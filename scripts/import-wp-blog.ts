/**
 * Import every blog post from a WordPress REST API into the new CMS.
 *
 *   1. Pages /wp-json/wp/v2/posts?per_page=100&_embed=1 until exhausted
 *   2. Upserts an Author per unique WP user (author dedup by name)
 *   3. Downloads each featured image to public/assets/images/blog/
 *   4. Upserts BlogPost rows keyed by their original WP slug
 *   5. Writes lib/wp-blog-redirects.ts — a redirects array mapping
 *      `/<wp-slug>` → `/blog/<wp-slug>` so the WordPress URL structure
 *      (which publishes posts at the root, not under /blog/) keeps working
 *
 * Idempotent — re-running upserts every row by slug, skips images already
 * present on disk.
 *
 * Usage:
 *   npm run import:blog
 *   npm run import:blog -- https://orionesolutions.com   # custom WP host
 *
 * After import, paste this into next.config.ts → redirects():
 *
 *   import { wpBlogRedirects } from './lib/wp-blog-redirects'
 *   ...
 *   async redirects() {
 *     return [
 *       ...wpBlogRedirects,
 *       // your other redirects below
 *     ]
 *   }
 */

import { promises as fs } from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_HOST       = 'https://orionesolutions.com'
const PER_PAGE           = 100
const CONCURRENT_POSTS   = 5
const IMAGE_DIR_REL      = 'assets/images/blog'

// ── Tiny HTML entity decoder (no deps) ───────────────────────────────────

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',  lt: '<',   gt: '>',   quot: '"',   apos: "'",
  nbsp: ' ', hellip: '…', ndash: '–', mdash: '—',
  laquo: '«', raquo: '»', copy: '©', reg: '®', trade: '™',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
}

function decodeEntities(s: string): string {
  if (!s) return s
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] || m)
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
}

function estimateReadingMinutes(content: string): number {
  const words = stripTags(content).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

// ── Network helpers ──────────────────────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'OrionBlogImporter/1.0', 'Accept': 'application/json' },
  })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return await r.json() as T
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    await fs.access(dest); return true   // already cached
  } catch { /* not cached, fall through */ }
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'OrionBlogImporter/1.0' }, redirect: 'follow' })
    if (!r.ok) { console.warn(`     ⚠ image ${r.status} ${url}`); return false }
    const buf = Buffer.from(await r.arrayBuffer())
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, buf)
    return true
  } catch (e) {
    console.warn(`     ⚠ image fetch failed ${url}: ${(e as Error).message}`)
    return false
  }
}

// ── WordPress API types (just what we use) ───────────────────────────────

interface WpPost {
  id: number
  date_gmt: string
  modified_gmt: string
  slug: string
  status: string
  title:   { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  author: number
  featured_media: number
  yoast_head_json?: {
    title?: string
    description?: string
    canonical?: string
    og_image?: { url?: string }[]
    schema?: { '@graph'?: Array<{ '@type'?: string; wordCount?: number }> }
  }
  _embedded?: {
    author?: Array<{ id: number; name: string; description?: string; avatar_urls?: Record<string, string> }>
    'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }>
    'wp:term'?: Array<Array<{ id: number; name: string; taxonomy: string }>>
  }
}

// ── Author handling ──────────────────────────────────────────────────────

const authorIdByWpName = new Map<string, string>()

async function ensureAuthor(p: WpPost): Promise<string> {
  const wpAuthor = p._embedded?.author?.[0]
  const name     = wpAuthor?.name?.trim() || 'Orion Editorial'

  const cached = authorIdByWpName.get(name)
  if (cached) return cached

  // Try to find by name first
  const existing = await prisma.author.findFirst({ where: { name } })
  if (existing) {
    authorIdByWpName.set(name, existing.id)
    return existing.id
  }

  // Pick a sensible avatar URL from WP's avatar_urls map
  const avatars = wpAuthor?.avatar_urls
  const avatarUrl = avatars
    ? (avatars['96'] || avatars['48'] || avatars['24'] || Object.values(avatars)[0])
    : null

  const created = await prisma.author.create({
    data: {
      name,
      role:      'Author',
      bio:       wpAuthor?.description?.trim() || null,
      avatarUrl: avatarUrl || null,
    },
  })
  authorIdByWpName.set(name, created.id)
  return created.id
}

// ── Featured image handling ──────────────────────────────────────────────

async function fetchFeaturedImage(p: WpPost, projectRoot: string): Promise<string | null> {
  const remote = p._embedded?.['wp:featuredmedia']?.[0]?.source_url
  if (!remote) return null

  const u = new URL(remote)
  // Use the full WP path (e.g. /wp-content/uploads/2025/11/foo.jpg) flattened
  // under public/assets/images/blog/ to avoid collisions across years.
  const flatName = u.pathname
    .replace(/^\/+wp-content\/+uploads\/+/, '')   // 2025/11/foo.jpg
    .replace(/\//g, '__')                          // 2025__11__foo.jpg
  const localRel = `${IMAGE_DIR_REL}/${flatName}`
  const localAbs = path.join(projectRoot, 'public', localRel)

  const ok = await downloadImage(remote, localAbs)
  return ok ? `/${localRel}` : remote   // fall back to remote URL if download fails
}

// ── Per-post import ──────────────────────────────────────────────────────

async function importPost(p: WpPost, projectRoot: string) {
  const authorId = await ensureAuthor(p)
  const imageUrl = await fetchFeaturedImage(p, projectRoot)

  const terms        = p._embedded?.['wp:term'] ?? []
  const categoryList = (terms[0] || []).map(t => t.name)
  const tagList      = (terms[1] || []).map(t => t.name)
  const category     = categoryList[0] || 'General'

  const yoast        = p.yoast_head_json
  const wordCount    = (yoast?.schema?.['@graph'] || []).find(g => g.wordCount)?.wordCount
  const readingTime  = wordCount
    ? Math.max(1, Math.round(wordCount / 200))
    : estimateReadingMinutes(p.content.rendered)

  const status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' =
    p.status === 'publish' ? 'PUBLISHED' :
    p.status === 'draft'   ? 'DRAFT'     :
                             'ARCHIVED'

  const data = {
    slug:        p.slug,
    title:       decodeEntities(p.title.rendered),
    excerpt:     stripTags(p.excerpt.rendered).slice(0, 1000),
    content:     p.content.rendered,
    category,
    tags:        tagList,
    authorId,
    status,
    publishedAt: status === 'PUBLISHED' ? new Date(p.date_gmt) : null,
    scheduledAt: null,
    readingTime,
    imageUrl,
    metaTitle:   (yoast?.title       || decodeEntities(p.title.rendered)).slice(0, 250),
    metaDesc:    (yoast?.description || stripTags(p.excerpt.rendered)).slice(0, 500),
  }

  await prisma.blogPost.upsert({
    where:  { slug: p.slug },
    update: data,
    create: data,
  })
}

// ── Pagination ───────────────────────────────────────────────────────────

async function* paginatePosts(host: string): AsyncGenerator<WpPost[]> {
  let page = 1
  while (true) {
    const url = `${host}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&_embed=1&orderby=date&order=desc&page=${page}`
    let batch: WpPost[]
    try {
      batch = await fetchJson<WpPost[]>(url)
    } catch (e) {
      const msg = (e as Error).message
      // WP returns 400 with code rest_post_invalid_page_number when we walk past the end
      if (msg.includes('400') || msg.includes('404')) return
      throw e
    }
    if (!Array.isArray(batch) || batch.length === 0) return
    yield batch
    if (batch.length < PER_PAGE) return
    page++
  }
}

// ── Concurrency pool ─────────────────────────────────────────────────────

async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++
        try { await fn(items[idx]) }
        catch (e) { console.warn(`   ⚠ post failed: ${(e as Error).message}`) }
      }
    })
  )
}

// ── Redirect file generation ─────────────────────────────────────────────

async function writeRedirectsFile(slugs: string[], projectRoot: string) {
  const rels = slugs.map(s => `  { source: '/${s}', destination: '/blog/${s}', permanent: true },`).join('\n')
  const out = `// AUTO-GENERATED by scripts/import-wp-blog.ts — do not hand-edit.
// Maps the original WordPress URLs (where blog posts lived at the root)
// to the new /blog/<slug> canonical URLs. Spread into next.config.ts → redirects().

export const wpBlogRedirects = [
${rels}
]
`
  const dest = path.join(projectRoot, 'lib', 'wp-blog-redirects.ts')
  await fs.writeFile(dest, out, 'utf-8')
  console.log(`📝  Wrote ${slugs.length} redirects to lib/wp-blog-redirects.ts`)
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const host = (process.argv[2] || DEFAULT_HOST).replace(/\/+$/, '')
  const projectRoot = process.cwd()

  console.log(`📚 Importing blog from ${host}/wp-json/wp/v2/posts\n`)

  let total = 0
  const allSlugs: string[] = []

  for await (const batch of paginatePosts(host)) {
    console.log(`📦 Page batch: ${batch.length} posts (total so far: ${total + batch.length})`)
    await pool(batch, CONCURRENT_POSTS, async (post) => {
      await importPost(post, projectRoot)
      console.log(`   ✔  ${post.slug}`)
      allSlugs.push(post.slug)
    })
    total += batch.length
  }

  console.log(`\n✅ Imported ${total} posts. Author cache size: ${authorIdByWpName.size}`)

  await writeRedirectsFile(allSlugs, projectRoot)

  console.log('\n🚦 Final step — wire the redirects into next.config.ts:\n')
  console.log(`   import { wpBlogRedirects } from './lib/wp-blog-redirects'\n`)
  console.log(`   async redirects() {`)
  console.log(`     return [`)
  console.log(`       ...wpBlogRedirects,`)
  console.log(`       // ...your existing redirects`)
  console.log(`     ]`)
  console.log(`   }\n`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
