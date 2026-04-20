import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { spamGuard } from '@/lib/spam-guard'
import { buildEmailHtml, sendResendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try { body = await req.json() } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const { name, email, phone, message, service, _hp, _ts } = body

  const blocked = await spamGuard(req, 'service-inquiry', {
    _hp, _ts,
    texts: [name, message],
    rateLimit: { max: 5, windowMs: 60_000 },
  })
  if (blocked) return NextResponse.json({ message: blocked.message }, { status: blocked.status })

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ message: 'Name, email, and message are required.' }, { status: 422 })
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'

  try {
    await db.contactSubmission.create({
      data: {
        name: name.trim(), email: email.trim(),
        phone: phone?.trim() || null,
        service: service?.trim() || null,
        message: message.trim(),
        ipAddress: ip,
        status: 'NEW',
      },
    })
  } catch (err) { console.error('[ServiceInquiry] DB error:', err) }

  try {
    const toEmail = process.env.CONTACT_EMAIL || SITE_CONFIG.email
    const rows = [
      { label: 'Name',    value: name.trim(),    href: undefined },
      { label: 'Email',   value: email.trim(),   href: `mailto:${email.trim()}` },
      ...(phone?.trim()   ? [{ label: 'Phone',   value: phone.trim()   }] : []),
      ...(service?.trim() ? [{ label: 'Service', value: service.trim() }] : []),
    ]
    await sendResendEmail({
      to: toEmail,
      replyTo: email.trim(),
      subject: `New Inquiry — ${service || 'Service'} (${name})`,
      html: buildEmailHtml({ heading: 'New Service Inquiry', rows, body: message.trim() }),
    })
  } catch (err) { console.error('[ServiceInquiry] Email error:', err) }

  return NextResponse.json({ success: true })
}
