import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIp, isBlockedIp } from '@/lib/spam-guard'

const BOT_RE = /bot|crawler|spider|slurp|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|semrush|ahrefsbot|mj12bot/i

const PRIVATE_IP = /^(127\.|192\.168\.|10\.|::1$|fc00:|fe80:)/

async function resolveGeo(ip: string, req: NextRequest): Promise<{ country: string | null; city: string | null }> {
  // 1. Cloudflare headers
  let country = req.headers.get('cf-ipcountry') || null
  if (country === 'XX' || country === 'T1') country = null

  let city: string | null = null

  // 2. Vercel headers (available in Node.js serverless on Vercel)
  if (!country) country = req.headers.get('x-vercel-ip-country') || null
  const vercelCity = req.headers.get('x-vercel-ip-city')
  if (vercelCity) {
    try { city = decodeURIComponent(vercelCity) } catch { city = vercelCity }
  }

  // 3. External API fallback (ipwho.is — free, HTTPS, no key needed)
  if (!country && !PRIVATE_IP.test(ip) && ip !== 'unknown') {
    try {
      const res = await fetch(`https://ipwho.is/${ip}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2000),
      })
      if (res.ok) {
        const data = await res.json() as { country_code?: string; city?: string; success?: boolean }
        if (data.success !== false && data.country_code) {
          country = data.country_code
          city = city ?? data.city ?? null
        }
      }
    } catch { /* non-fatal */ }
  }

  // 4. geoip-lite (local dev only)
  if (!country && !PRIVATE_IP.test(ip) && ip !== 'unknown') {
    try {
      const geoip = (await import('geoip-lite')).default
      const geo   = geoip.lookup(ip)
      country = geo?.country ?? null
      city    = city ?? geo?.city ?? null
    } catch { /* optional */ }
  }

  return { country, city }
}

export async function POST(req: NextRequest) {
  try {
    const body    = await req.json().catch(() => ({}))
    const ip      = getIp(req)
    const ua      = req.headers.get('user-agent') ?? ''
    const isBot   = BOT_RE.test(ua)

    if (await isBlockedIp(ip)) return new NextResponse(null, { status: 204 })

    const path     = String(body.path     ?? '/').slice(0, 500)
    const referrer = String(body.referrer ?? '').slice(0, 500) || null

    const { country, city } = await resolveGeo(ip, req)

    await prisma.pageView.create({
      data: { path, ip, country, city, ua: ua.slice(0, 500) || null, referrer, bot: isBot },
    })
  } catch {
    // Analytics must never break the site
  }

  return new NextResponse(null, { status: 204 })
}
