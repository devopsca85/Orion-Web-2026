/**
 * WordPress → Orion CMS Migration Script
 *
 * Fetches all published pages and posts from a WordPress site via its
 * built-in REST API and upserts them into the Prisma database.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/migrate-from-wp.ts
 *   (or: npm run migrate:wp)
 *
 * Env vars (set in .env):
 *   WP_SITE_URL        = https://orionesolutions.com
 *   WP_USERNAME        = your-wp-username       (optional — for private content)
 *   WP_APP_PASSWORD    = xxxx xxxx xxxx xxxx    (optional — WP Application Password)
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WP_URL = (process.env.WP_SITE_URL || 'https://orionesolutions.com').replace(/\/$/, '')
const WP_USER = process.env.WP_USERNAME || ''
const WP_PASS = process.env.WP_APP_PASSWORD || ''

// Pages to skip (WP default slugs not worth importing)
const SKIP_SLUGS = new Set(['sample-page', 'home', 'front-page'])

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  if (!WP_USER || !WP_PASS) return {}
  const token = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')
  return { Authorization: `Basic ${token}` }
}

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = []
  let page = 1

  while (true) {
    const url = `${WP_URL}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}&_embed&status=publish`
    const res = await fetch(url, { headers: authHeaders() })

    if (res.status === 400) break // WP returns 400 when page > totalPages
    if (!res.ok) throw new Error(`WP API ${res.status}: ${url}`)

    const batch = (await res.json()) as T[]
    if (!Array.isArray(batch) || batch.length === 0) break
    results.push(...batch)

    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10)
    if (page >= totalPages) break
    page++

    await delay(150)
  }

  return results
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// Strip HTML tags and decode common entities
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '…')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// Clean WP-specific noise from content
function cleanContent(html: string): string {
  return html
    .replace(/<!-- \/?wp:[a-z/-]+ ?(\{[^}]*\})? ?-->/g, '') // Gutenberg block comments
    .replace(/\[[\w-]+ ?[^\]]*\]([\s\S]*?)\[\/[\w-]+\]/g, '$1') // Paired shortcodes (keep content)
    .replace(/\[[\w-]+ ?[^\]]*\/?\]/g, '')                       // Self-closing shortcodes
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + '…'
}

// ─────────────────────────────────────────────────────────────────────────────
// WP API types
// ─────────────────────────────────────────────────────────────────────────────

interface WpRendered { rendered: string }

interface WpAuthorEmbed {
  name: string
  description?: string
  avatar_urls?: Record<string, string>
}

interface WpMediaEmbed { source_url: string }

interface WpTermEmbed { name: string; taxonomy: string }

interface WpPost {
  id: number
  slug: string
  date: string
  title: WpRendered
  content: WpRendered
  excerpt: WpRendered
  _embedded?: {
    author?: WpAuthorEmbed[]
    'wp:featuredmedia'?: WpMediaEmbed[]
    'wp:term'?: WpTermEmbed[][]
  }
}

interface WpPage extends WpPost {
  parent: number
  menu_order: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Migrate: Pages
// ─────────────────────────────────────────────────────────────────────────────

async function migratePages(pages: WpPage[]) {
  const eligible = pages.filter((p) => !SKIP_SLUGS.has(p.slug))
  console.log(`\n📄 Pages: ${pages.length} found, ${eligible.length} to import`)

  let ok = 0
  let skipped = 0

  for (const wp of eligible) {
    const slug = wp.slug || slugify(stripHtml(wp.title.rendered))
    const title = truncate(stripHtml(wp.title.rendered), 250)
    const content = cleanContent(wp.content.rendered)
    const excerptClean = stripHtml(wp.excerpt.rendered) || truncate(stripHtml(content), 490)
    const excerpt = truncate(excerptClean, 490)

    try {
      await prisma.page.upsert({
        where: { slug },
        update: {
          title,
          content,
          excerpt: excerpt || null,
          status: 'PUBLISHED',
        },
        create: {
          slug,
          title,
          content,
          excerpt: excerpt || null,
          status: 'PUBLISHED',
          template: 'default',
          sortOrder: wp.menu_order || 0,
        },
      })
      console.log(`  ✓  /${slug}`)
      ok++
    } catch (err) {
      console.warn(`  ✗  /${slug} — ${(err as Error).message}`)
      skipped++
    }

    await delay(50)
  }

  console.log(`     → ${ok} imported, ${skipped} skipped`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Migrate: Posts
// ─────────────────────────────────────────────────────────────────────────────

async function migratePosts(posts: WpPost[]) {
  console.log(`\n📝 Posts: ${posts.length} to import`)

  let ok = 0
  let skipped = 0

  for (const wp of posts) {
    const slug = wp.slug || slugify(stripHtml(wp.title.rendered))
    const title = truncate(stripHtml(wp.title.rendered), 250)
    const content = cleanContent(wp.content.rendered)
    const excerptClean = stripHtml(wp.excerpt.rendered) || truncate(stripHtml(content), 490)
    const excerpt = truncate(excerptClean, 490)
    const imageUrl = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || null

    // Author
    const wpAuthor = wp._embedded?.author?.[0]
    const authorName = wpAuthor?.name || 'Orion eSolutions'
    const authorId = slugify(authorName)

    // Category & tags from embedded terms
    const terms = wp._embedded?.['wp:term'] ?? []
    const cats = (terms[0] ?? []).filter((t) => t.taxonomy === 'category').map((t) => t.name)
    const tags = (terms[1] ?? []).filter((t) => t.taxonomy === 'post_tag').map((t) => t.name)
    const category = cats.find((c) => c !== 'Uncategorized') ?? cats[0] ?? 'General'

    try {
      // Ensure author exists
      await prisma.author.upsert({
        where: { id: authorId },
        update: {},
        create: {
          id: authorId,
          name: authorName,
          role: 'Content Writer',
          bio: wpAuthor?.description || null,
          avatarUrl: wpAuthor?.avatar_urls?.['96'] || null,
        },
      })

      await prisma.blogPost.upsert({
        where: { slug },
        update: {
          title,
          content,
          excerpt,
          category: truncate(category, 80),
          tags,
          imageUrl,
          status: 'PUBLISHED',
        },
        create: {
          slug,
          title,
          content,
          excerpt,
          category: truncate(category, 80),
          tags,
          authorId,
          status: 'PUBLISHED',
          featured: false,
          publishedAt: new Date(wp.date),
          readingTime: readingTime(content),
          imageUrl,
        },
      })

      console.log(`  ✓  /blog/${slug}`)
      ok++
    } catch (err) {
      console.warn(`  ✗  /blog/${slug} — ${(err as Error).message}`)
      skipped++
    }

    await delay(50)
  }

  console.log(`     → ${ok} imported, ${skipped} skipped`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('════════════════════════════════════════════')
  console.log('  WordPress → Orion CMS Migration')
  console.log('════════════════════════════════════════════')
  console.log(`  Source : ${WP_URL}`)
  console.log(`  Auth   : ${WP_USER ? `${WP_USER} (authenticated)` : 'public (no auth)'}`)

  // Verify WP API is reachable
  try {
    const res = await fetch(`${WP_URL}/wp-json/`, { headers: authHeaders() })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    console.log('  WP API : ✓ connected\n')
  } catch (err) {
    console.error(`\n❌  Cannot reach WP API at ${WP_URL}/wp-json/`)
    console.error(`    ${(err as Error).message}`)
    console.error('\n    Check that:')
    console.error('    1. WP_SITE_URL is correct in .env')
    console.error('    2. The WordPress REST API is not disabled')
    console.error('    3. Your server can make outbound HTTPS requests')
    process.exit(1)
  }

  // Fetch everything in parallel
  console.log('  Fetching content from WordPress...')
  const [wpPages, wpPosts] = await Promise.all([
    fetchAll<WpPage>('pages'),
    fetchAll<WpPost>('posts'),
  ])

  console.log(`\n  Found: ${wpPages.length} page(s) · ${wpPosts.length} post(s)`)

  await migratePages(wpPages)
  await migratePosts(wpPosts)

  console.log('\n════════════════════════════════════════════')
  console.log('  ✅  Migration complete')
  console.log('════════════════════════════════════════════')
  console.log('\n  Next steps:')
  console.log('  • /admin/pages  — review imported pages, publish/edit as needed')
  console.log('  • /admin/blog   — review imported posts, set featured images')
  console.log('\n  All content is imported as PUBLISHED. Set individual items')
  console.log('  to DRAFT in the admin panel if you need to review before going live.\n')
}

main()
  .catch((err) => {
    console.error('\n❌  Migration failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
