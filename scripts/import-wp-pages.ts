/**
 * Import WordPress pages from /wp-json/wp/v2/pages into structured Page rows.
 *
 * What this is replacing:
 *   The clone-live-page approach (now deleted) mirrored entire WP HTML
 *   documents and rendered them in iframes / inline. Result was brittle,
 *   non-editable, CSS-bleeding pages. This importer takes the same data
 *   from the WP REST API but produces clean Page rows that:
 *     • use the site's design system (Tailwind .prose typography)
 *     • are editable in TipTap via /admin/pages/<id>
 *     • carry over Yoast SEO metadata (title, description, og image, canonical)
 *     • have featured images downloaded locally
 *
 * Scope:
 *   • Only top-level WP pages (parent === 0). Nested WP pages like
 *     /services/<sub>/ are skipped — they're handled by hand-built Tier-1
 *     routes (app/(public)/services/[slug]/page.tsx, etc.).
 *   • Slugs in TIER1_SLUGS are skipped — they exist as proper Next.js
 *     route components and we don't want to overwrite them.
 *
 * Cleaning applied to WP HTML:
 *   • Drop <script>, <style>, <noscript>, <iframe>
 *   • Strip class=, id=, style=, data-* attributes (Elementor framework leftovers)
 *   • Strip WP block / Gutenberg HTML comments
 *   • Collapse empty paragraphs and runaway whitespace
 *
 * Idempotent — re-runs upsert by slug. Safe to run repeatedly.
 *
 * Usage:
 *   npm run import:wp-pages
 *   npm run import:wp-pages -- https://orionesolutions.com
 */

import { promises as fs } from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_HOST     = 'https://orionesolutions.com'
const PER_PAGE         = 100
const CONCURRENT_PAGES = 5
const IMAGE_DIR_REL    = 'assets/images/pages'

// Slugs already served by hand-built Next.js routes — never overwrite.
const TIER1_SLUGS = new Set([
  'about',
  'about-us',
  'blog',
  'careers',
  'contact',
  'contact-us',
  'cookie-policy',
  'industries',
  'partners',
  'portfolio',
  'case-studies',
  'privacy-policy',
  'products',
  'resources',
  'services',
  'sitemap-page',
  'terms-of-service',
])

// ── HTML utilities (no deps) ─────────────────────────────────────────────

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

function cleanPageHtml(raw: string): string {
  let html = raw

  html = html.replace(/<script\b[\s\S]*?<\/script>/gi,   '')
  html = html.replace(/<style\b[\s\S]*?<\/style>/gi,     '')
  html = html.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '')
  html = html.replace(/<iframe\b[\s\S]*?<\/iframe>/gi,   '')

  // WP / Gutenberg block markers and any other HTML comments
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  // Strip class / id / style / data-* / aria-* / role attributes
  html = html.replace(/\s+(?:class|id|style|data-[\w-]+|aria-[\w-]+|role)\s*=\s*"[^"]*"/gi, '')
  html = html.replace(/\s+(?:class|id|style|data-[\w-]+|aria-[\w-]+|role)\s*=\s*'[^']*'/gi, '')

  // Strip fixed pixel sizes from images so they shrink to fit their column
  html = html.replace(/(<img[^>]*?)\s+(?:width|height)\s*=\s*"[^"]*"/gi, '$1')
  html = html.replace(/(<img[^>]*?)\s+(?:width|height)\s*=\s*'[^']*'/gi, '$1')

  // Unwrap layout containers — once their classes are stripped they only
  // contribute dead whitespace and odd nesting. Keep their children.
  html = html.replace(/<\/?(?:section|article|aside|figure|figcaption|main)\b[^>]*>/gi, '')

  // Iteratively collapse empty containers until stable. WP / Elementor
  // produces deeply nested empties from decorative columns + icon spots.
  let prev: string
  do {
    prev = html
    html = html.replace(/<(div|span|p)[^>]*>\s*(?:&nbsp;|&#160;|\s)*<\/\1>/gi, '')
  } while (html !== prev)

  // Collapse runs of <br>
  html = html.replace(/(?:<br\s*\/?>\s*){2,}/gi, '<br>')

  // Empty paragraphs (possibly with non-breaking spaces) and excessive blank lines
  html = html.replace(/<p>\s*(?:&nbsp;| |\s)*<\/p>/gi, '')
  html = html.replace(/\n{3,}/g, '\n\n')

  return html.trim()
}

// ── Network helpers ──────────────────────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'OrionPageImporter/1.0', 'Accept': 'application/json' },
  })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return await r.json() as T
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try { await fs.access(dest); return true } catch { /* fall through */ }
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'OrionPageImporter/1.0' }, redirect: 'follow' })
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

// ── WP API types (only the fields we use) ────────────────────────────────

interface WpPage {
  id:       number
  date_gmt: string
  modified_gmt: string
  slug:     string
  status:   string
  parent:   number
  link:     string
  title:    { rendered: string }
  content:  { rendered: string }
  excerpt:  { rendered: string }
  featured_media: number
  yoast_head_json?: {
    title?:       string
    description?: string
    canonical?:   string
    og_image?:    { url?: string }[]
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }>
  }
}

async function fetchFeaturedImage(p: WpPage, projectRoot: string): Promise<string | null> {
  const remote = p._embedded?.['wp:featuredmedia']?.[0]?.source_url
  if (!remote) return null

  const u = new URL(remote)
  const flatName = u.pathname
    .replace(/^\/+wp-content\/+uploads\/+/, '')
    .replace(/\//g, '__')
  const localRel = `${IMAGE_DIR_REL}/${flatName}`
  const localAbs = path.join(projectRoot, 'public', localRel)

  const ok = await downloadImage(remote, localAbs)
  return ok ? `/${localRel}` : remote
}

// ── Per-page import ──────────────────────────────────────────────────────

interface ImportResult {
  slug:     string
  imported: boolean
  reason?:  string
}

async function importPage(p: WpPage, projectRoot: string): Promise<ImportResult> {
  if (p.parent !== 0) {
    return { slug: p.slug, imported: false, reason: 'nested page (parent != 0) — handled by Tier-1 routes' }
  }
  if (TIER1_SLUGS.has(p.slug)) {
    return { slug: p.slug, imported: false, reason: 'Tier-1 hand-built route' }
  }

  const cleanedHtml = cleanPageHtml(p.content.rendered)
  const ogImage     = await fetchFeaturedImage(p, projectRoot)
  const yoast       = p.yoast_head_json

  const status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' =
    p.status === 'publish' ? 'PUBLISHED' :
    p.status === 'draft'   ? 'DRAFT'     :
                             'ARCHIVED'

  const titleDecoded = decodeEntities(p.title.rendered)

  const data = {
    slug:         p.slug,
    title:        titleDecoded,
    content:      cleanedHtml,
    excerpt:      stripTags(p.excerpt.rendered).slice(0, 500)
                  || stripTags(cleanedHtml).slice(0, 300),
    status,
    template:     'default',
    metaTitle:    (yoast?.title       || titleDecoded).slice(0, 70),
    metaDesc:     (yoast?.description || stripTags(p.excerpt.rendered)).slice(0, 160),
    ogTitle:      (yoast?.title       || titleDecoded).slice(0, 70),
    ogDescription:(yoast?.description || stripTags(p.excerpt.rendered)).slice(0, 200),
    ogImage,
    canonicalUrl: yoast?.canonical || null,
  }

  await prisma.page.upsert({
    where:  { slug: p.slug },
    update: data,
    create: data,
  })

  return { slug: p.slug, imported: true }
}

// ── Pagination + concurrency ─────────────────────────────────────────────

async function* paginate(host: string): AsyncGenerator<WpPage[]> {
  let page = 1
  while (true) {
    const url = `${host}/wp-json/wp/v2/pages?per_page=${PER_PAGE}&_embed=1&orderby=date&order=desc&page=${page}`
    let batch: WpPage[]
    try {
      batch = await fetchJson<WpPage[]>(url)
    } catch (e) {
      const msg = (e as Error).message
      if (msg.includes('400') || msg.includes('404')) return
      throw e
    }
    if (!Array.isArray(batch) || batch.length === 0) return
    yield batch
    if (batch.length < PER_PAGE) return
    page++
  }
}

async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++
        try { await fn(items[idx]) }
        catch (e) { console.warn(`   ⚠ failed: ${(e as Error).message}`) }
      }
    })
  )
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const host = (process.argv[2] || DEFAULT_HOST).replace(/\/+$/, '')
  const projectRoot = process.cwd()

  console.log(`📚 Importing pages from ${host}/wp-json/wp/v2/pages\n`)

  let totalSeen = 0
  let imported  = 0
  let skipped   = 0
  const skippedReasons: Record<string, number> = {}

  for await (const batch of paginate(host)) {
    console.log(`📦 Batch: ${batch.length} pages (total seen so far: ${totalSeen + batch.length})`)
    await pool(batch, CONCURRENT_PAGES, async (p) => {
      const r = await importPage(p, projectRoot)
      if (r.imported) {
        console.log(`   ✔  ${r.slug}`)
        imported++
      } else {
        console.log(`   ⏭   ${r.slug.padEnd(40)} ${r.reason}`)
        skipped++
        skippedReasons[r.reason || 'unknown'] = (skippedReasons[r.reason || 'unknown'] || 0) + 1
      }
    })
    totalSeen += batch.length
  }

  console.log(`\n✅ Done.`)
  console.log(`   ${imported}   imported as Page rows`)
  console.log(`   ${skipped}   skipped`)
  for (const [reason, n] of Object.entries(skippedReasons)) {
    console.log(`     • ${n}× ${reason}`)
  }
  console.log(`   ${totalSeen}   total pages seen in WP`)
  console.log(`\nNext: open /admin/pages and review imported rows. Tweak content,`)
  console.log(`adjust meta tags, publish drafts. Run npm run audit:live to verify`)
  console.log(`MISSING count drops.\n`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
