import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { SITE_CONFIG } from '@/lib/constants';
import { db } from '@/lib/db';

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
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // Skip verification in development
    if (process.env.NODE_ENV === 'development') return true;
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });
    const data = await response.json();
    return data.success === true && (data.score ?? 1) >= 0.5;
  } catch {
    return false;
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
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL || SITE_CONFIG.email;

  if (!apiKey) {
    // Log in development, skip email send
    if (process.env.NODE_ENV === 'development') {
      console.log('[Contact Form] Email would be sent:', { to: toEmail, data });
      return;
    }
    throw new Error('Email service not configured');
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: `${SITE_CONFIG.name} Website <noreply@${new URL(SITE_CONFIG.url).hostname}>`,
    to: toEmail,
    replyTo: data.email,
    subject: `New Contact Form Submission — ${data.name}${data.company ? ` (${data.company})` : ''}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          ${data.company ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company}</td></tr>` : ''}
          ${data.phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>` : ''}
          ${data.service ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.service}</td></tr>` : ''}
        </table>
        <h3 style="color: #1e3a8a; margin-top: 16px;">Message</h3>
        <div style="background: #f8fafc; border-left: 4px solid #1e3a8a; padding: 12px 16px; white-space: pre-wrap;">${data.message}</div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Submitted via ${SITE_CONFIG.url}/contact</p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
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
