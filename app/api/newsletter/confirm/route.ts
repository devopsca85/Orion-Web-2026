import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { checkRateLimit, getIp } from '@/lib/spam-guard'

export async function GET(req: NextRequest) {
  const ip = getIp(req)
  if (!checkRateLimit('newsletter-confirm', ip, { max: 10, windowMs: 60_000 })) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`)
  }

  const token = req.nextUrl.searchParams.get('token')

  if (!token || token.length < 32 || !/^[a-f0-9]+$/i.test(token)) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`)
  }

  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { confirmToken: token },
    select: { id: true, confirmed: true },
  })

  if (!subscriber) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`)
  }

  if (subscriber.confirmed) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=already-confirmed`)
  }

  await db.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { confirmed: true, confirmedAt: new Date(), confirmToken: null },
  })

  return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=confirmed`)
}
