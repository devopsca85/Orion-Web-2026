import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { SITE_CONFIG } from '@/lib/constants'
import { createHmac } from 'crypto'

function generateUnsubscribeUrl(email: string): string {
  const secret = process.env.NEWSLETTER_SECRET || process.env.NEXTAUTH_SECRET || 'secret'
  const sig = createHmac('sha256', secret).update(email.toLowerCase()).digest('hex')
  return `${SITE_CONFIG.url}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&sig=${sig}`
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  let body: { subject: string; html: string; segment: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  const { subject, html, segment } = body
  if (!subject?.trim() || !html?.trim()) {
    return NextResponse.json({ message: 'Subject and content are required.' }, { status: 422 })
  }

  // Load subscribers based on segment
  const where =
    segment === 'all'
      ? { unsubscribed: false }
      : { confirmed: true, unsubscribed: false }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where,
    select: { email: true, name: true },
  })

  if (subscribers.length === 0) {
    return NextResponse.json({ message: 'No subscribers in the selected segment.' }, { status: 400 })
  }

  const s = await getSettings(['email.provider', 'email.resend_api_key', 'email.brevo_api_key', 'email.from_name', 'email.from_email'])
  const provider  = s['email.provider'] || 'resend'
  const fromName  = s['email.from_name']  || SITE_CONFIG.name
  const fromEmail = s['email.from_email'] || `noreply@${new URL(SITE_CONFIG.url).hostname}`
  const year = new Date().getFullYear()

  const resendKey = s['email.resend_api_key'] || process.env.RESEND_API_KEY
  const brevoKey  = s['email.brevo_api_key']  || process.env.BREVO_API_KEY

  if (provider === 'brevo' && !brevoKey) {
    return NextResponse.json({ message: 'Brevo API key not configured in Email Settings.' }, { status: 500 })
  }
  if (provider !== 'brevo' && !resendKey) {
    return NextResponse.json({ message: 'Resend API key not configured in Email Settings.' }, { status: 500 })
  }

  const resend = provider !== 'brevo' ? (await import('resend')).Resend && new (await import('resend')).Resend(resendKey!) : null

  let sent = 0
  let failed = 0

  for (const sub of subscribers) {
    const unsubUrl = generateUnsubscribeUrl(sub.email)
    const personalizedHtml = `
      <div style="font-family:sans-serif;max-width:650px;margin:0 auto">
        <div style="background:#1e3a8a;padding:20px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:700">${fromName}</h1>
        </div>
        <div style="padding:32px 24px;background:#ffffff;border:1px solid #e2e8f0;border-top:none">
          ${html}
        </div>
        <div style="padding:16px 24px;text-align:center;color:#94a3b8;font-size:12px;background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
          &copy; ${year} ${fromName}. All rights reserved.<br/>
          You are receiving this email because you subscribed at ${SITE_CONFIG.url}.<br/>
          <a href="${encodeURI(unsubUrl)}" style="color:#6366f1;text-decoration:underline">Unsubscribe</a>
        </div>
      </div>
    `
    try {
      if (provider === 'brevo') {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': brevoKey!, 'content-type': 'application/json' },
          body: JSON.stringify({
            sender: { name: fromName, email: fromEmail },
            to: [{ email: sub.email, name: sub.name || undefined }],
            subject,
            htmlContent: personalizedHtml,
            headers: { 'List-Unsubscribe': `<${encodeURI(unsubUrl)}>` },
          }),
        })
        if (!res.ok) throw new Error(`Brevo ${res.status}`)
      } else {
        await resend!.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: sub.email,
          subject,
          html: personalizedHtml,
          headers: {
            'List-Unsubscribe': `<${encodeURI(unsubUrl)}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })
      }
      sent++
    } catch (err) {
      console.error(`[Newsletter] Failed to send to ${sub.email}:`, err)
      failed++
    }
  }

  return NextResponse.json({
    message: `Newsletter sent to ${sent} subscriber${sent !== 1 ? 's' : ''}${failed > 0 ? ` (${failed} failed)` : ''}.`,
    sent,
    failed,
  })
}
