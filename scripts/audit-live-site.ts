/**
 * Audit the live orionesolutions.com site against the new Next.js project.
 *
 * Fetches the live WordPress sitemap, classifies every URL, and prints a
 * launch-readiness report:
 *
 *   ✅  COVERED       — URL has a matching route in app/(public)/...
 *   🔁  REDIRECT      — slug differs (e.g. /about-us → /about); needs a 301
 *   📄  PAGE-EMPTY    — route exists but no Page row / no content yet
 *   ⚙️  DYNAMIC       — handled by [slug] route; data-row presence not checked
 *   📰  BLOG-POST     — covered by an imported BlogPost row
 *   ❌  MISSING       — no route, no Page row; needs a redirect or a proper import
 *
 * Run on a server with network access to orionesolutions.com:
 *
 *   npm run audit:live
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LIVE_HOST       = 'https://orionesolutions.com'
const SITEMAP_INDEX   = `${LIVE_HOST}/sitemap_index.xml`

// Top-level path → existing route in app/(public)/. Single-segment URLs that
// match one of these segments are considered COVERED at minimum.
const EXISTING_TOP_LEVEL_ROUTES = new Set([
  'about',
  'blog',
  'careers',
  'contact',
  'cookie-policy',
  'industries',
  'partners',
  'portfolio',
  'privacy-policy',
  'products',
  'resources',
  'services',
  'sitemap-page',
  'terms-of-service',
])

// Live-URL slugs that should 301 → a different new-site slug.
const REDIRECT_MAP: Record<string, string> = {
  'about-us':       '/about',
  'contact-us':     '/contact',
  'case-studies':   '/portfolio',
}

type Classification = 'COVERED' | 'REDIRECT' | 'PAGE-EMPTY' | 'DYNAMIC' | 'BLOG-POST' | 'MISSING'

interface AuditRow {
  url:     string
  pathname:string
  slug:    string         // first segment, e.g. "services"
  segments:string[]       // every segment
  status:  Classification
  hint:    string
}

// Pre-loaded DB indexes to avoid 400+ point lookups during classification
interface DbIndex {
  pageBySlug:    Map<string, { id: string; content: string }>
  blogPostSlugs: Set<string>
}

async function loadDb(): Promise<DbIndex> {
  const [pages, posts] = await Promise.all([
    prisma.page.findMany({
      where:  { parentSlug: null },
      select: { id: true, slug: true, content: true },
    }),
    prisma.blogPost.findMany({ select: { slug: true } }),
  ])
  return {
    pageBySlug:    new Map(pages.map(p => [p.slug, { id: p.id, content: p.content }])),
    blogPostSlugs: new Set(posts.map(p => p.slug)),
  }
}

// ── XML helpers (no deps) ────────────────────────────────────────────────

function extractLocs(xml: string): string[] {
  const out: string[] = []
  const RE = /<loc>([^<]+)<\/loc>/g
  let m: RegExpExecArray | null
  while ((m = RE.exec(xml))) out.push(m[1].trim())
  return out
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'OrionAudit/1.0' } })
    if (!r.ok) { console.warn(`   ⚠ ${r.status} ${url}`); return null }
    return await r.text()
  } catch (e) {
    console.warn(`   ⚠ fetch failed ${url}: ${(e as Error).message}`)
    return null
  }
}

async function gatherSitemapUrls(): Promise<string[]> {
  console.log(`📥 Fetching ${SITEMAP_INDEX}`)
  const indexXml = await fetchText(SITEMAP_INDEX)
  if (!indexXml) {
    // Fall back to a single sitemap.xml
    const one = await fetchText(`${LIVE_HOST}/sitemap.xml`)
    if (!one) throw new Error('Could not fetch any sitemap')
    return extractLocs(one)
  }

  const childSitemaps = extractLocs(indexXml)
  console.log(`   ↳ ${childSitemaps.length} child sitemaps`)

  const all = new Set<string>()
  for (const cs of childSitemaps) {
    const xml = await fetchText(cs)
    if (!xml) continue
    for (const loc of extractLocs(xml)) all.add(loc)
  }
  return Array.from(all)
}

// ── Classification ───────────────────────────────────────────────────────

function classify(url: string, db: DbIndex): AuditRow {
  const u        = new URL(url)
  const pathname = u.pathname.replace(/\/+$/, '') || '/'
  const segments = pathname === '/' ? [] : pathname.slice(1).split('/')
  const slug     = segments[0] || ''

  if (pathname === '/') {
    return { url, pathname, slug: '', segments, status: 'COVERED', hint: 'Real homepage at app/(public)/page.tsx' }
  }

  if (REDIRECT_MAP[slug]) {
    return { url, pathname, slug, segments, status: 'REDIRECT', hint: `301 → ${REDIRECT_MAP[slug]}` }
  }

  // Multi-segment URL — handled by a dynamic route under that top-level
  if (segments.length > 1 && EXISTING_TOP_LEVEL_ROUTES.has(slug)) {
    return {
      url, pathname, slug, segments,
      status: 'DYNAMIC',
      hint:   `Goes through app/(public)/${slug}/[slug]/page.tsx — verify the row exists in DB`,
    }
  }

  // Single-segment URL matching an existing route
  if (segments.length === 1 && EXISTING_TOP_LEVEL_ROUTES.has(slug)) {
    return { url, pathname, slug, segments, status: 'COVERED', hint: `app/(public)/${slug}/page.tsx` }
  }

  // Single-segment, no matching route — check Page table, then BlogPost
  if (segments.length === 1) {
    const page = db.pageBySlug.get(slug)
    if (page) {
      const empty = !page.content || page.content.trim().length < 50
      return {
        url, pathname, slug, segments,
        status: empty ? 'PAGE-EMPTY' : 'COVERED',
        hint:   empty ? `Page row exists but content is empty/short` : `Page row id=${page.id}`,
      }
    }
    if (db.blogPostSlugs.has(slug)) {
      return {
        url, pathname, slug, segments,
        status: 'BLOG-POST',
        hint:   `BlogPost imported — served at /blog/${slug}; root URL 301s via wpBlogRedirects`,
      }
    }
    return { url, pathname, slug, segments, status: 'MISSING', hint: 'No route, no Page row, no BlogPost' }
  }

  // Deep URL (e.g. /wp-content/...) — usually irrelevant, mark missing
  return { url, pathname, slug, segments, status: 'MISSING', hint: 'Deep URL, likely needs ignoring or redirect' }
}

// ── Reporting ────────────────────────────────────────────────────────────

function fmt(rows: AuditRow[]) {
  const groups: Record<Classification, AuditRow[]> = {
    'COVERED':    [],
    'REDIRECT':   [],
    'DYNAMIC':    [],
    'BLOG-POST':  [],
    'PAGE-EMPTY': [],
    'MISSING':    [],
  }
  for (const r of rows) groups[r.status].push(r)

  const ICON: Record<Classification, string> = {
    'COVERED':    '✅',
    'REDIRECT':   '🔁',
    'DYNAMIC':    '⚙️ ',
    'BLOG-POST':  '📰',
    'PAGE-EMPTY': '📄',
    'MISSING':    '❌',
  }

  console.log('\n📊 Launch-readiness audit\n')
  for (const k of Object.keys(groups) as Classification[]) {
    const list = groups[k]
    console.log(`${ICON[k]}  ${k}  (${list.length})`)
    for (const r of list.slice(0, 30)) {
      console.log(`     ${r.pathname.padEnd(50)} ${r.hint}`)
    }
    if (list.length > 30) console.log(`     … and ${list.length - 30} more`)
    console.log('')
  }

  return groups
}

function printRedirectBlock(rows: AuditRow[]) {
  const reds = rows.filter(r => r.status === 'REDIRECT')
  if (reds.length === 0) return
  console.log('📋 Add to next.config.ts → redirects():\n')
  for (const r of reds) {
    const dest = REDIRECT_MAP[r.slug]
    console.log(`     { source: '${r.pathname}', destination: '${dest}', permanent: true },`)
  }
  console.log('')
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🗄️  Loading DB indexes…`)
  const db = await loadDb()
  console.log(`   ↳ ${db.pageBySlug.size} Page rows, ${db.blogPostSlugs.size} BlogPost rows`)

  const urls = await gatherSitemapUrls()
  console.log(`   ↳ ${urls.length} URLs in sitemap\n`)

  console.log(`🔍 Classifying…`)
  const rows: AuditRow[] = urls.map(u => classify(u, db))

  const groups = fmt(rows)
  printRedirectBlock(rows)

  console.log('💡 Next moves:')
  console.log(`   • ${groups.COVERED.length}    URLs already work — verify visually`)
  console.log(`   • ${groups['BLOG-POST'].length}  URLs covered by imported BlogPost rows (301 to /blog/<slug>)`)
  console.log(`   • ${groups.REDIRECT.length}   URLs need a 301 (paste block above into next.config.ts)`)
  console.log(`   • ${groups.DYNAMIC.length}    URLs go through dynamic routes — check the matching DB table has a row`)
  console.log(`   • ${groups['PAGE-EMPTY'].length}    Page rows exist but are empty — open /admin/pages and fill them`)
  console.log(`   • ${groups.MISSING.length}    URLs have no home — add a redirect in next.config.ts or import via npm run import:wp-pages`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
