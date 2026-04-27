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
 *   ❌  MISSING       — no route, no Page row; needs cloning or a new component
 *
 * Run on a server with network access to orionesolutions.com:
 *
 *   npm run audit:live
 *
 * Add  --clone-missing  to also clone every MISSING URL into Page rows.
 *
 *   npm run audit:live -- --clone-missing
 */

import { PrismaClient } from '@prisma/client'
import { clonePage } from './clone-live-page'

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

type Classification = 'COVERED' | 'REDIRECT' | 'PAGE-EMPTY' | 'DYNAMIC' | 'MISSING'

interface AuditRow {
  url:     string
  pathname:string
  slug:    string         // first segment, e.g. "services"
  segments:string[]       // every segment
  status:  Classification
  hint:    string
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

async function classify(url: string): Promise<AuditRow> {
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

  // Single-segment, no matching route — check Page table
  if (segments.length === 1) {
    try {
      const page = await prisma.page.findFirst({ where: { slug, parentSlug: null } })
      if (page) {
        const empty = !page.content || page.content.trim().length < 50
        return {
          url, pathname, slug, segments,
          status: empty ? 'PAGE-EMPTY' : 'COVERED',
          hint:   empty ? `Page row exists but content is empty/short` : `Page row id=${page.id}`,
        }
      }
    } catch { /* ignore */ }
    return { url, pathname, slug, segments, status: 'MISSING', hint: 'No route, no Page row' }
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
    'PAGE-EMPTY': [],
    'MISSING':    [],
  }
  for (const r of rows) groups[r.status].push(r)

  const ICON: Record<Classification, string> = {
    'COVERED':    '✅',
    'REDIRECT':   '🔁',
    'DYNAMIC':    '⚙️ ',
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

// ── Optional clone of MISSING URLs ───────────────────────────────────────

async function cloneMissing(rows: AuditRow[]) {
  const candidates = rows.filter(r =>
    r.status === 'MISSING' &&
    r.segments.length === 1 &&
    !r.slug.startsWith('wp-') &&
    !r.slug.startsWith('feed') &&
    !r.slug.startsWith('comments')
  )
  console.log(`\n🧬 Cloning ${candidates.length} MISSING single-segment URLs as Page rows…\n`)
  for (const r of candidates) {
    try {
      await clonePage(r.url, r.slug)
    } catch (e) {
      console.warn(`   ⚠ ${r.url}: ${(e as Error).message}`)
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const cloneFlag = process.argv.includes('--clone-missing')

  const urls = await gatherSitemapUrls()
  console.log(`   ↳ ${urls.length} URLs in sitemap\n`)

  console.log(`🔍 Classifying…`)
  const rows: AuditRow[] = []
  for (const u of urls) rows.push(await classify(u))

  const groups = fmt(rows)
  printRedirectBlock(rows)

  console.log('💡 Next moves:')
  console.log(`   • ${groups.COVERED.length}    URLs already work — verify visually`)
  console.log(`   • ${groups.REDIRECT.length}   URLs need a 301 (paste block above into next.config.ts)`)
  console.log(`   • ${groups.DYNAMIC.length}    URLs go through dynamic routes — check the matching DB table has a row`)
  console.log(`   • ${groups['PAGE-EMPTY'].length} Page rows exist but are empty — open /admin/pages and fill them`)
  console.log(`   • ${groups.MISSING.length}    URLs have no home — re-run with --clone-missing to import`)

  if (cloneFlag) await cloneMissing(rows)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
