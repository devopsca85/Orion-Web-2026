import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { SITE_CONFIG } from '@/lib/constants';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
});

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sendConfirmationEmail(email: string, token: string, name?: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const confirmUrl = `${SITE_CONFIG.url}/api/newsletter/confirm?token=${token}`;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Newsletter] Confirmation email would be sent:', { email, confirmUrl });
      return;
    }
    throw new Error('Email service not configured');
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: `${SITE_CONFIG.name} <noreply@${new URL(SITE_CONFIG.url).hostname}>`,
    to: email,
    subject: `Confirm your subscription to ${SITE_CONFIG.name} Insights`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a8a; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${SITE_CONFIG.name}</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <h2 style="color: #1e3a8a;">Confirm Your Subscription</h2>
          <p>Hi${name ? ` ${name}` : ''},</p>
          <p>Thanks for subscribing to <strong>${SITE_CONFIG.name} Insights</strong>. We'll send you monthly technology insights from our engineering and consulting teams.</p>
          <p>Click the button below to confirm your email address:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${confirmUrl}" style="background: #f97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Confirm Subscription
            </a>
          </p>
          <p style="color: #64748b; font-size: 13px;">Or copy this link: ${confirmUrl}</p>
          <p style="color: #64748b; font-size: 13px;">If you didn't subscribe, you can ignore this email — you won't receive anything further.</p>
        </div>
        <div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.flatten().fieldErrors.email?.[0] ?? 'Invalid input.' },
      { status: 422 }
    );
  }

  const { email, name, source } = parsed.data;

  // Check if already subscribed
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing) {
    if (existing.confirmed && !existing.unsubscribed) {
      return NextResponse.json(
        { message: 'You are already subscribed!' },
        { status: 200 }
      );
    }

    // Resend confirmation if not yet confirmed or previously unsubscribed
    const token = generateToken();
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        confirmToken: token,
        unsubscribed: false,
        unsubAt: null,
        confirmed: false,
        confirmedAt: null,
      },
    });

    try {
      await sendConfirmationEmail(email, token, name ?? existing.name ?? undefined);
    } catch (err) {
      console.error('[Newsletter] Email error:', err);
    }
    syncToBrevo(email, name ?? existing.name ?? undefined).catch(() => null);

    return NextResponse.json({ message: 'Please check your email to confirm your subscription.' });
  }

  const token = generateToken();

  await prisma.newsletterSubscriber.create({
    data: {
      email,
      name: name ?? null,
      source: source ?? null,
      confirmToken: token,
      confirmed: false,
    },
  });

  try {
    await sendConfirmationEmail(email, token, name);
  } catch (err) {
    console.error('[Newsletter] Email error:', err);
  }
  syncToBrevo(email, name).catch(() => null);

  return NextResponse.json(
    { message: 'Thanks! Please check your email to confirm your subscription.' },
    { status: 201 }
  );
}

async function syncToBrevo(email: string, name?: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LIST_ID || '0');
  if (!apiKey || !listId) return;

  await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      attributes: name ? { FIRSTNAME: name } : {},
      listIds: [listId],
      updateEnabled: true,
    }),
  });
}
