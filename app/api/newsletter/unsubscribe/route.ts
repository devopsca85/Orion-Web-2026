import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SITE_CONFIG } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=invalid`);
  }

  await db.newsletterSubscriber.updateMany({
    where: { email },
    data: { unsubscribed: true, unsubAt: new Date() },
  });

  return NextResponse.redirect(`${SITE_CONFIG.url}/?newsletter=unsubscribed`);
}
