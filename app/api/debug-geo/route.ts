import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => { headers[k] = v })

  const [total, withCountry, sample] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { country: { not: null } } }),
    prisma.pageView.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { ip: true, country: true, city: true, createdAt: true },
    }),
  ])

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') || 'unknown'

  let geoTest: unknown = null
  try {
    const r = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(3000) })
    geoTest = await r.json()
  } catch (e) { geoTest = String(e) }

  return NextResponse.json({
    dbStats: { total, withCountry, withoutCountry: total - withCountry },
    recentRows: sample,
    currentRequest: {
      ip,
      'x-vercel-ip-country': req.headers.get('x-vercel-ip-country'),
      'x-vercel-ip-city': req.headers.get('x-vercel-ip-city'),
      'cf-ipcountry': req.headers.get('cf-ipcountry'),
    },
    ipwhoResult: geoTest,
  })
}
