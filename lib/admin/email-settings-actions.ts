'use server'
import { revalidatePath } from 'next/cache'
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
  revalidatePath('/admin/email-settings')
  redirect('/admin/email-settings?saved=1')
}

export async function getEmailSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany({ where: { key: { startsWith: 'email.' } } })
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function testEmailSettings(formData: FormData) {
  await requireAdmin()
  const provider = formData.get('provider') as string
  const toEmail = formData.get('test_to') as string

  if (!toEmail) {
    redirect('/admin/email-settings?error=no-email')
  }

  try {
    if (provider === 'resend') {
      const apiKey = formData.get('email.resend_api_key') as string
      if (!apiKey) redirect('/admin/email-settings?error=no-key')
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      const fromName = (formData.get('email.from_name') as string) || 'Orion eSolutions'
      const fromEmail = (formData.get('email.from_email') as string) || 'noreply@orionesolutions.com'
      await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: toEmail,
        subject: 'Orion CMS — Email test',
        html: '<p>This is a test email from Orion CMS. Email settings are working correctly.</p>',
      })
    }
    redirect('/admin/email-settings?tested=1')
  } catch {
    redirect('/admin/email-settings?error=send-failed')
  }
}
