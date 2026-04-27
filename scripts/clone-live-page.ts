/**
 * Clone a live page (HTML + every CSS / JS / image / font it references on
 * the same origin) into this project, then save it as a Page row whose
 * slug renders pixel-identical to the live site via the iframe path in
 * app/(public)/[slug]/page.tsx.
 *
 * Usage:
 *   npm run clone:page                                          # defaults to orionesolutions.com → /home-clone
 *   npm run clone:page -- https://www.orionesolutions.com/ home-clone
 *   npm run clone:page -- https://orionesolutions.com/about/ about-clone
 *
 * What it does:
 *   1. Fetches the page HTML
 *   2. Walks every href/src/data-src and every url(...) in inline / linked CSS
 *   3. Downloads each same-origin asset to public/cloned/<slug>/assets/<original-path>
 *   4. For each CSS file, also downloads the fonts/images it references
 *   5. Rewrites all matching URLs in the HTML to /cloned/<slug>/assets/...
 *   6. Saves the rewritten HTML as a Page row (status PUBLISHED)
 *   7. Also writes the HTML to disk for debugging
 *
 * Idempotent — re-runs overwrite the Page row and overwrite changed assets.
 *
 * Trade-offs:
 *   - The page renders inside an iframe (not editable through the section CMS)
 *   - Third-party CDN assets (Google Fonts, Cloudflare CDN, etc.) are NOT
 *     downloaded — they keep loading from their original URLs, which is fine
 *     because those CDNs are reliable and usually CORS-clean.
 */

import { promises as fs } from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_URL  = 'https://www.orionesolutions.com/'
const DEFAULT_SLUG = 'home-clone'

const USER_AGENT =
  'Mozilla/5.0 (compatible; OrionCMSClone/1.0; +https://www.orionesolutions.com)'

const CONCURRENT_DOWNLOADS = 10

// ── Helpers ──────────────────────────────────────────────────────────────

function ensureLeadingSlash(p: string) {
  return p.startsWith('/') ? p : '/' + p
}

/** Strip query string + fragment for filesystem safety, keep extension. */
function urlToLocalPath(u: URL): string {
  let pathname = u.pathname
  if (pathname.endsWith('/')) pathname += 'index.html'
  return pathname.replace(/^\/+/, '')
}

/** Resolve a possibly-relative URL against a base. Returns null if invalid. */
function resolveUrl(raw: string, base: string): URL | null {
  try {
    const cleaned = raw.trim()
    if (!cleaned) return null
    if (cleaned.startsWith('data:')) return null
    if (cleaned.startsWith('javascript:')) return null
    if (cleaned.startsWith('#')) return null
    return new URL(cleaned, base)
  } catch { return null }
}

async function fetchBuffer(url: string): Promise<{ buf: Buffer; contentType: string } | null> {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept': '*/*' },
      redirect: 'follow',
    })
    if (!r.ok) {
      console.warn(`   ⚠ ${r.status} ${url}`)
      return null
    }
    const buf = Buffer.from(await r.arrayBuffer())
    const contentType = r.headers.get('content-type') || ''
    return { buf, contentType }
  } catch (e) {
    console.warn(`   ⚠ fetch failed ${url}: ${(e as Error).message}`)
    return null
  }
}

async function writeFile(absPath: string, data: Buffer | string) {
  await fs.mkdir(path.dirname(absPath), { recursive: true })
  await fs.writeFile(absPath, data)
}

async function fileExists(p: string): Promise<boolean> {
  try { await fs.access(p); return true } catch { return false }
}

/** Run async tasks with a concurrency cap. */
async function pool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let i = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++
      await worker(items[idx])
    }
  })
  await Promise.all(runners)
}

// ── URL extraction ───────────────────────────────────────────────────────

/** Pull out URLs from href=, src=, data-src=, data-href=, srcset= attributes. */
function extractHtmlUrls(html: string): string[] {
  const out: string[] = []

  // attr="url" or attr='url'
  const ATTR = /(?:href|src|data-src|data-href|content|poster)\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = ATTR.exec(html))) out.push(m[1])

  // srcset has comma-separated URLs with optional descriptors
  const SRCSET = /srcset\s*=\s*["']([^"']+)["']/gi
  while ((m = SRCSET.exec(html))) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0]
      if (url) out.push(url)
    }
  }

  // CSS url(...) inside inline <style> or style="..."
  const CSS_URL = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi
  while ((m = CSS_URL.exec(html))) out.push(m[1])

  return out
}

/** Pull url(...) references out of a CSS file. */
function extractCssUrls(css: string): string[] {
  const out: string[] = []
  const RE = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi
  let m: RegExpExecArray | null
  while ((m = RE.exec(css))) out.push(m[1])
  return out
}

// ── Main clone routine ───────────────────────────────────────────────────

export async function clonePage(pageUrl: string, slug: string) {
  const startUrl    = new URL(pageUrl)
  const sameOrigin  = startUrl.origin
  const publicRoot  = path.join(process.cwd(), 'public', 'cloned', slug)
  const assetsRoot  = path.join(publicRoot, 'assets')
  const localPrefix = `/cloned/${slug}/assets`

  console.log(`\n🌐  Fetching ${pageUrl}`)
  const top = await fetchBuffer(pageUrl)
  if (!top) throw new Error(`Could not fetch ${pageUrl}`)
  let html = top.buf.toString('utf-8')

  // Pass 1 — collect every same-origin URL referenced from the HTML
  const htmlUrls = extractHtmlUrls(html)
  const queue = new Map<string, URL>() // absolute URL → URL object
  for (const raw of htmlUrls) {
    const u = resolveUrl(raw, pageUrl)
    if (!u) continue
    if (u.origin !== sameOrigin) continue       // skip third-party CDNs
    queue.set(u.href.split('#')[0], u)          // dedupe; drop fragment
  }
  console.log(`   ↳ ${queue.size} same-origin assets referenced from HTML`)

  // Pass 2 — download those, and for any CSS we get back also queue its sub-assets
  const downloaded = new Map<string, string>() // absolute URL → local web path
  const cssToProcess: { url: URL; css: string }[] = []

  await pool(Array.from(queue.values()), CONCURRENT_DOWNLOADS, async (u) => {
    const rel = urlToLocalPath(u)
    const abs = path.join(assetsRoot, rel)
    const webPath = `${localPrefix}/${rel}`

    if (await fileExists(abs)) {
      downloaded.set(u.href, webPath)
      return
    }
    const got = await fetchBuffer(u.href)
    if (!got) return
    await writeFile(abs, got.buf)
    downloaded.set(u.href, webPath)
    if (got.contentType.includes('text/css') || rel.endsWith('.css')) {
      cssToProcess.push({ url: u, css: got.buf.toString('utf-8') })
    }
  })
  console.log(`   ↳ downloaded ${downloaded.size} top-level assets`)

  // Pass 3 — for each CSS, download its url(...) references and rewrite them
  let cssSubAssets = 0
  for (const { url: cssUrl, css } of cssToProcess) {
    const subUrls = extractCssUrls(css)
    const cssRel  = urlToLocalPath(cssUrl)
    const cssAbs  = path.join(assetsRoot, cssRel)
    const subMap  = new Map<string, string>() // raw → local

    await pool(subUrls, CONCURRENT_DOWNLOADS, async (raw) => {
      const u = resolveUrl(raw, cssUrl.href)
      if (!u || u.origin !== sameOrigin) return
      const rel = urlToLocalPath(u)
      const abs = path.join(assetsRoot, rel)
      const webPath = `${localPrefix}/${rel}`
      if (!(await fileExists(abs))) {
        const got = await fetchBuffer(u.href)
        if (!got) return
        await writeFile(abs, got.buf)
        cssSubAssets++
      }
      subMap.set(raw, webPath)
    })

    // Rewrite this CSS file: each raw url(...) → local path, written relative
    // to the CSS file's location so the browser resolves correctly.
    const cssDirWeb = path.posix.dirname(`${localPrefix}/${cssRel}`)
    let rewritten = css
    for (const [raw, webPath] of subMap) {
      const relFromCss = path.posix.relative(cssDirWeb, webPath)
      const re = new RegExp(`url\\(\\s*['"]?${escapeRe(raw)}['"]?\\s*\\)`, 'g')
      rewritten = rewritten.replace(re, `url(${relFromCss})`)
    }
    if (rewritten !== css) await writeFile(cssAbs, rewritten)
  }
  console.log(`   ↳ downloaded ${cssSubAssets} CSS sub-assets (fonts, images)`)

  // Pass 4 — rewrite the HTML so all original URLs point at the local mirror
  for (const [origUrl, webPath] of downloaded) {
    // Replace exact absolute URL
    html = html.split(origUrl).join(webPath)
    // Also strip the protocol-only form //host/path that some attrs use
    const protoRel = origUrl.replace(/^https?:/, '')
    html = html.split(protoRel).join(webPath)
  }
  // Catch protocol-relative or root-relative references that the HTML left
  // (e.g. href="/wp-content/..." in case-stripped attrs)
  html = html.replace(
    new RegExp(escapeRe(sameOrigin), 'g'),
    ''
  )

  // Pass 5 — save Page row and dump HTML to disk
  await writeFile(path.join(publicRoot, 'index.html'), html)

  await prisma.page.upsert({
    where:  { slug },
    update: { content: html, status: 'PUBLISHED', title: `${startUrl.host} clone` },
    create: {
      slug,
      title:    `${startUrl.host} clone`,
      content:  html,
      status:   'PUBLISHED',
      template: 'full-width',
    },
  })

  console.log(`\n✅ Cloned ${pageUrl}`)
  console.log(`   → Page row:   /${slug}`)
  console.log(`   → Local HTML: public/cloned/${slug}/index.html`)
  console.log(`   → Assets:     public/cloned/${slug}/assets/  (${downloaded.size + cssSubAssets} files)`)
  console.log(`\nVisit: http://localhost:3000/${slug}\n`)
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ── Entrypoint ───────────────────────────────────────────────────────────

async function main() {
  const url  = process.argv[2] || DEFAULT_URL
  const slug = process.argv[3] || DEFAULT_SLUG
  await clonePage(url, slug)
}

// Only run main() when invoked directly via CLI, not when imported by another
// script (e.g. scripts/audit-live-site.ts re-uses clonePage).
if (require.main === module) {
  main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
