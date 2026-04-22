import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIp, isBlockedIp } from '@/lib/spam-guard'

const BOT_RE = /bot|crawler|spider|slurp|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|semrush|ahrefsbot|mj12bot/i
const PRIVATE_IP = /^(127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc00:|fe80:)/

async function resolveGeo(ip: string, req: NextRequest): Promise<{ country: string | null; city: string | null }> {
  // 1. Cloudflare
  let country = req.headers.get('cf-ipcountry') || null
  if (country === 'XX' || country === 'T1') country = null

  let city: string | null = null

  // 2. Vercel edge
  if (!country) country = req.headers.get('x-vercel-ip-country') || null
  const vercelCity = req.headers.get('x-vercel-ip-city')
  if (vercelCity) {
    try { city = decodeURIComponent(vercelCity) } catch { city = vercelCity }
  }

  if (country || PRIVATE_IP.test(ip) || ip === 'unknown') return { country, city }

  // 3. ipapi.co — free 30k/month, HTTPS, server-side friendly
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'orion-analytics/1.0' },
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const d = await res.json() as { country_code?: string; city?: string; error?: boolean; reason?: string }
      if (!d.error && d.country_code && d.country_code.length === 2) {
        country = d.country_code
        city = d.city ?? null
      }
    }
  } catch { /* non-fatal */ }

  if (country) return { country, city }

  // 4. ip-api.com — free HTTP fallback (no HTTPS on free tier, works server-side)
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const d = await res.json() as { status?: string; countryCode?: string; city?: string }
      if (d.status === 'success' && d.countryCode) {
        country = d.countryCode
        city = d.city ?? null
      }
    }
  } catch { /* non-fatal */ }

  if (country) return { country, city }

  // 5. geoip-lite last resort (works in local dev / non-serverless)
  try {
    const geoip = (await import('geoip-lite')).default
    const geo = geoip.lookup(ip)
    country = geo?.country ?? null
    city = geo?.city ?? null
  } catch { /* optional */ }

  return { country, city }
}

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json().catch(() => ({}))
    const ip    = getIp(req)
    const ua    = req.headers.get('user-agent') ?? ''
    const isBot = BOT_RE.test(ua)

    if (await isBlockedIp(ip)) return new NextResponse(null, { status: 204 })

    const path     = String(body.path     ?? '/').slice(0, 500)
    const referrer = String(body.referrer ?? '').slice(0, 500) || null

    const { country, city } = await resolveGeo(ip, req)

    await prisma.pageView.create({
      data: { path, ip, country, city, ua: ua.slice(0, 500) || null, referrer, bot: isBot },
    })
  } catch { /* analytics must never break the site */ }

  return new NextResponse(null, { status: 204 })
}
