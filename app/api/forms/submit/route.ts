import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

export async function POST(req: NextRequest) {
  let body: { formId: string; data: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  const { formId, data } = body
  if (!formId || typeof data !== 'object') {
    return NextResponse.json({ message: 'formId and data are required.' }, { status: 422 })
  }

  // Look up the form
  let form: { id: string; active: boolean; title: string; notifyEmail: string | null; fields: unknown } | null = null
  try {
    form = await db.form.findUnique({
      where: { id: formId },
      select: { id: true, active: true, title: true, notifyEmail: true, fields: true },
    })
  } catch (err) {
    console.error('[Forms Submit] DB lookup error:', err)
    return NextResponse.json({ message: 'Service unavailable.' }, { status: 503 })
  }

  if (!form || !form.active) {
    return NextResponse.json({ message: 'Form not found.' }, { status: 404 })
  }

  // Save submission
  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null
  try {
    await db.formSubmission.create({
      data: { formId: form.id, data: data as Record<string, string>, ipAddress },
    })
  } catch (err) {
    console.error('[Forms Submit] DB insert error:', err)
  }

  // Send notification email
  try {
    const toEmail = form.notifyEmail || process.env.CONTACT_EMAIL || SITE_CONFIG.email
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey && toEmail) {
      const fields = Array.isArray(form.fields) ? (form.fields as { name: string; label: string }[]) : []
      const rows = fields.map((f) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:160px">${f.label}</td><td style="padding:8px;border-bottom:1px solid #eee">${(data as Record<string, unknown>)[f.name] ?? ''}</td></tr>`).join('')
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: `${SITE_CONFIG.name} <noreply@${new URL(SITE_CONFIG.url).hostname}>`,
        to: toEmail,
        subject: `New form submission — ${form.title}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1d4ed8">New submission: ${form.title}</h2><table style="width:100%;border-collapse:collapse">${rows}</table><p style="color:#94a3b8;font-size:12px;margin-top:24px">Submitted via ${SITE_CONFIG.url}</p></div>`,
      })
    }
  } catch (err) {
    console.error('[Forms Submit] Email error:', err)
  }

  return NextResponse.json({ success: true })
}
