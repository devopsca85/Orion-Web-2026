import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try { body = await req.json() } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const { name, email, phone, message, service } = body
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
    const apiKey  = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_EMAIL || SITE_CONFIG.email
    if (apiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: `${SITE_CONFIG.name} <noreply@${new URL(SITE_CONFIG.url).hostname}>`,
        to: toEmail,
        replyTo: email.trim(),
        subject: `New Inquiry — ${service || 'Service'} (${name})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1d4ed8">New Service Inquiry</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:120px">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Phone</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>` : ''}
              ${service ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Service</td><td style="padding:8px;border-bottom:1px solid #eee">${service}</td></tr>` : ''}
            </table>
            <h3 style="color:#1d4ed8;margin-top:16px">Message</h3>
            <div style="background:#f8fafc;border-left:4px solid #1d4ed8;padding:12px 16px;white-space:pre-wrap">${message}</div>
          </div>`,
      })
    }
  } catch (err) { console.error('[ServiceInquiry] Email error:', err) }

  return NextResponse.json({ success: true })
}
