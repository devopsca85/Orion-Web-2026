import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { spamGuard } from '@/lib/spam-guard'
import { buildEmailHtml, escapeHtml, sendResendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  let body: { formId: string; data: Record<string, unknown>; _hp?: string; _ts?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  const { formId, data, _hp, _ts } = body

  const blocked = await spamGuard(req, `form-${formId}`, {
    _hp, _ts,
    texts: Object.values(data ?? {}).map((v) => String(v ?? '')),
    rateLimit: { max: 5, windowMs: 60_000 },
  })
  if (blocked) return NextResponse.json({ message: blocked.message }, { status: blocked.status })

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
    if (toEmail) {
      const fields = Array.isArray(form.fields) ? (form.fields as { name: string; label: string }[]) : []
      const rows = fields.map((f) => ({
        label: f.label,
        value: String((data as Record<string, unknown>)[f.name] ?? ''),
      }))
      await sendResendEmail({
        to: toEmail,
        subject: `New form submission — ${escapeHtml(form.title)}`,
        html: buildEmailHtml({ heading: `New submission: ${form.title}`, rows }),
      })
    }
  } catch (err) {
    console.error('[Forms Submit] Email error:', err)
  }

  return NextResponse.json({ success: true })
}
