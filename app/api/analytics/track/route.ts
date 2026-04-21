import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIp, isBlockedIp } from '@/lib/spam-guard'

const BOT_RE = /bot|crawler|spider|slurp|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|semrush|ahrefsbot|mj12bot/i

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json().catch(() => ({}))
    const ip     = getIp(req)
    const ua     = req.headers.get('user-agent') ?? ''
    const isBot  = BOT_RE.test(ua)

    if (await isBlockedIp(ip)) return new NextResponse(null, { status: 204 })

    const path     = String(body.path     ?? '/').slice(0, 500)
    const referrer = String(body.referrer ?? '').slice(0, 500) || null

    // Prefer platform-injected geo headers (Cloudflare / Vercel) — these work in serverless
    let country: string | null =
      req.headers.get('cf-ipcountry') ||          // Cloudflare (most reliable)
      req.headers.get('x-vercel-ip-country') ||   // Vercel Edge
      null
    // Normalise: Cloudflare sends 'XX' for unknown
    if (country === 'XX' || country === 'T1') country = null

    let city: string | null =
      req.headers.get('x-vercel-ip-city') ||      // Vercel (URL-encoded)
      null
    if (city) {
      try { city = decodeURIComponent(city) } catch { /* keep raw */ }
    }

    // Fall back to geoip-lite when running locally (no platform headers)
    if (!country && ip !== 'unknown' && ip !== '127.0.0.1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        const geoip = (await import('geoip-lite')).default
        const geo   = geoip.lookup(ip)
        country = geo?.country ?? null
        city    = city ?? geo?.city ?? null
      } catch { /* geoip optional */ }
    }

    await prisma.pageView.create({
      data: { path, ip, country, city, ua: ua.slice(0, 500) || null, referrer, bot: isBot },
    })
  } catch {
    // Analytics must never break the site
  }

  return new NextResponse(null, { status: 204 })
}
