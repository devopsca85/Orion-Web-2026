import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SITE_CONFIG } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token || token.length < 32) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`);
  }

  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { confirmToken: token },
  });

  if (!subscriber) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`);
  }

  if (subscriber.confirmed) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=already-confirmed`);
  }

  await db.newsletterSubscriber.update({
    where: { confirmToken: token },
    data: {
      confirmed: true,
      confirmedAt: new Date(),
      confirmToken: null, // consume the token
    },
  });

  return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=confirmed`);
}
