'use server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) throw new Error('Admins only')
}

const EMAIL_KEYS = [
  'email.provider',
  'email.from_name',
  'email.from_email',
  'email.contact_to',
  'email.resend_api_key',
  'email.brevo_api_key',
  'email.brevo_list_id',
  'email.smtp_host',
  'email.smtp_port',
  'email.smtp_user',
  'email.smtp_pass',
  'email.smtp_secure',
  'recaptcha.site_key',
  'recaptcha.secret_key',
  'recaptcha.disabled',
]

export async function saveEmailSettings(formData: FormData) {
  await requireAdmin()
  const ops = EMAIL_KEYS.map((key) => {
    const value = (formData.get(key) as string) || ''
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  })
  await Promise.all(ops)
  revalidateTag('site-settings')
  revalidatePath('/admin/email-settings')
  redirect('/admin/email-settings?saved=1')
}

export async function getEmailSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...EMAIL_KEYS] } },
  })
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function testEmailSettings(formData: FormData) {
  await requireAdmin()
  const toEmail = (formData.get('test_to') as string)?.trim()
  if (!toEmail) redirect('/admin/email-settings?error=no-email')

  // Read current saved settings from DB
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: EMAIL_KEYS } } })
  const s: Record<string, string> = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  const provider  = s['email.provider'] || 'resend'
  const fromName  = s['email.from_name'] || 'Orion eSolutions'
  const fromEmail = s['email.from_email'] || 'noreply@orionesolutions.com'
  const subject   = 'Orion CMS — Email connection test'
  const html      = `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
    <h2 style="color:#1e3a8a">Email Test Successful</h2>
    <p>Your <strong>${provider === 'brevo' ? 'Brevo' : 'Resend'}</strong> email settings are configured correctly.</p>
    <p style="color:#64748b;font-size:13px">Sent from Orion CMS Email Settings</p>
  </div>`

  try {
    if (provider === 'brevo') {
      const apiKey = s['email.brevo_api_key'] || process.env.BREVO_API_KEY || ''
      if (!apiKey) redirect('/admin/email-settings?error=no-key')
      const body = {
        sender: { name: fromName, email: fromEmail },
        to: [{ email: toEmail }],
        subject,
        htmlContent: html,
      }
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error('[Email Test/Brevo] Failed:', res.status, err)
        redirect('/admin/email-settings?error=send-failed')
      }
    } else {
      const apiKey = s['email.resend_api_key'] || process.env.RESEND_API_KEY || ''
      if (!apiKey) redirect('/admin/email-settings?error=no-key')
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      const result = await resend.emails.send({ from: `${fromName} <${fromEmail}>`, to: toEmail, subject, html })
      if (result.error) {
        console.error('[Email Test/Resend] Failed:', result.error)
        redirect('/admin/email-settings?error=send-failed')
      }
    }
  } catch (err) {
    console.error('[Email Test] Exception:', err)
    redirect('/admin/email-settings?error=send-failed')
  }

  redirect('/admin/email-settings?tested=1')
}
