import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { checkRateLimit, getIp } from '@/lib/spam-guard'

function verifySignature(email: string, sig: string): boolean {
  const secret = process.env.NEWSLETTER_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) return false
  try {
    const expected = createHmac('sha256', secret).update(email.toLowerCase()).digest('hex')
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const ip = getIp(req)
  if (!checkRateLimit('newsletter-unsub', ip, { max: 10, windowMs: 60_000 })) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`)
  }

  const email = req.nextUrl.searchParams.get('email')
  const sig   = req.nextUrl.searchParams.get('sig')

  if (!email || !sig || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`)
  }

  if (!verifySignature(email, sig)) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`)
  }

  await db.newsletterSubscriber.updateMany({
    where: { email: email.toLowerCase() },
    data: { unsubscribed: true, unsubAt: new Date() },
  })

  return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=unsubscribed`)
}
