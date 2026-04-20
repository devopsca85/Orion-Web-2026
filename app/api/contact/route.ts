import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { SITE_CONFIG } from '@/lib/constants';
import { db } from '@/lib/db';
import { isHoneypot, hasSpamContent, isBlockedIp, getIp } from '@/lib/spam-guard';
import { buildEmailHtml, sendResendEmail } from '@/lib/email';
import { getSetting } from '@/lib/settings';

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);

  if (!entry || now > entry.resetTime) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count += 1;
  return true;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  // Admin can disable reCAPTCHA entirely from Email Settings
  const disabled = await getSetting('recaptcha.disabled', '');
  if (disabled === 'true') return true;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY || await getSetting('recaptcha.secret_key', '');
  const siteKey   = await getSetting('recaptcha.site_key', '');
  // Only verify when both keys are configured
  if (!secretKey || !siteKey) return true;
  // Placeholder tokens mean reCAPTCHA script wasn't loaded — skip
  if (!token || token === 'bypass' || token === 'bypass-in-dev') return true;

  try {
    const res  = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    console.log('[reCAPTCHA] verify response:', JSON.stringify(data));
    if (data.success !== true) {
      console.warn('[reCAPTCHA] Failed — error-codes:', data['error-codes']);
      return false;
    }
    const score = data.score ?? 1;
    if (score < 0.3) {
      console.warn('[reCAPTCHA] Score too low:', score);
      return false;
    }
    return true;
  } catch (err) {
    // Google unreachable — fail open so legitimate users aren't blocked
    console.warn('[reCAPTCHA] Verification request threw — allowing submission:', err);
    return true;
  }
}

async function sendEmail(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
}): Promise<void> {
  const toEmail = await getSetting('email.contact_to', '') || process.env.CONTACT_EMAIL || SITE_CONFIG.email;
  const rows = [
    { label: 'Name',    value: data.name,    href: undefined },
    { label: 'Email',   value: data.email,   href: `mailto:${data.email}` },
    ...(data.company ? [{ label: 'Company', value: data.company }] : []),
    ...(data.phone   ? [{ label: 'Phone',   value: data.phone   }] : []),
    ...(data.service ? [{ label: 'Service', value: data.service }] : []),
  ];
  await sendResendEmail({
    to: toEmail,
    replyTo: data.email,
    subject: `New Contact Form Submission — ${data.name}${data.company ? ` (${data.company})` : ''}`,
    html: buildEmailHtml({
      heading: 'New Contact Form Submission',
      rows,
      body: data.message,
      footer: `Submitted via ${SITE_CONFIG.url}/contact`,
    }),
  });
}

export async function POST(req: NextRequest) {
  // IP block list
  const ip = getIp(req)
  if (await isBlockedIp(ip)) {
    return NextResponse.json({ message: 'Access denied.' }, { status: 403 })
  }

  // Rate limiting
  const rateLimitKey = getRateLimitKey(req);
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait a minute before trying again.' },
      { status: 429 }
    );
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { recaptchaToken, ...formData } = parsed.data;

  // Honeypot + spam content check
  const anyBody = body as Record<string, unknown>
  if (isHoneypot(anyBody._hp)) {
    return NextResponse.json({ message: 'Submission rejected.' }, { status: 400 })
  }
  if (hasSpamContent(formData.name, formData.message, formData.company)) {
    return NextResponse.json({ message: 'Your message was flagged as spam.' }, { status: 400 })
  }

  // Verify reCAPTCHA
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return NextResponse.json(
      { message: 'reCAPTCHA verification failed. Please try again.' },
      { status: 403 }
    );
  }

  const clientIp = getRateLimitKey(req);
  const userAgent = req.headers.get('user-agent') ?? undefined;

  // Persist submission to database
  try {
    await db.contactSubmission.create({
      data: {
        name: formData.name,
        email: formData.email,
        company: formData.company ?? null,
        phone: formData.phone || null,
        service: formData.service ?? null,
        message: formData.message,
        ipAddress: clientIp,
        userAgent: userAgent?.slice(0, 512) ?? null,
        status: 'NEW',
      },
    });
  } catch (err) {
    // Log DB error but don't block the user — still attempt email delivery
    console.error('[Contact API] DB insert error:', err);
  }

  // Send email
  try {
    await sendEmail(formData);
  } catch (err) {
    console.error('[Contact API] Email send error:', err);
    return NextResponse.json(
      { message: 'Failed to send your message. Please try again or contact us directly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 200 });
}

// Reject other HTTP methods
export function GET() {
  return NextResponse.json({ message: 'Method not allowed.' }, { status: 405 });
}
