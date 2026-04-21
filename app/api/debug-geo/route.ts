import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => { headers[key] = value })

  // Try external IP lookup
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  let geoResult: unknown = null
  try {
    const r = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(3000) })
    geoResult = await r.json()
  } catch (e) {
    geoResult = String(e)
  }

  return NextResponse.json({ ip, headers, geoResult })
}
