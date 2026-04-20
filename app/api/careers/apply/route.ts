import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { spamGuard } from '@/lib/spam-guard'
import { buildEmailHtml, sendResendEmail } from '@/lib/email'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_BYTES = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ message: 'Invalid form data.' }, { status: 400 })
  }

  const name        = (formData.get('name')        as string | null)?.trim() ?? ''
  const email       = (formData.get('email')       as string | null)?.trim() ?? ''
  const phone       = (formData.get('phone')       as string | null)?.trim() || null
  const role        = (formData.get('role')        as string | null)?.trim() ?? ''
  const jobId       = (formData.get('jobId')       as string | null)?.trim() || null
  const linkedinUrl = (formData.get('linkedinUrl') as string | null)?.trim() || null
  const portfolioUrl= (formData.get('portfolioUrl')as string | null)?.trim() || null
  const coverLetter = (formData.get('coverLetter') as string | null)?.trim() || null
  const cvFile      = formData.get('cv') as File | null
  const _hp         = formData.get('_hp') as string | null
  const _ts         = formData.get('_ts') as string | null

  const blocked = await spamGuard(req, 'careers-apply', {
    _hp, _ts,
    texts: [name, coverLetter],
    rateLimit: { max: 3, windowMs: 60_000 },
  })
  if (blocked) return NextResponse.json({ message: blocked.message }, { status: blocked.status })

  if (!name || !email || !role) {
    return NextResponse.json({ message: 'Name, email, and role are required.' }, { status: 422 })
  }

  // Handle CV file upload
  let resumeUrl: string | null = null
  if (cvFile && cvFile.size > 0) {
    if (!ALLOWED_TYPES.includes(cvFile.type)) {
      return NextResponse.json({ message: 'Only PDF or DOCX files are accepted.' }, { status: 422 })
    }
    if (cvFile.size > MAX_BYTES) {
      return NextResponse.json({ message: 'File must be under 5 MB.' }, { status: 422 })
    }
    const ext      = cvFile.type === 'application/pdf' ? 'pdf' : 'docx'
    const safeName = name.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const filename = `${Date.now()}-${safeName}.${ext}`
    const dir      = path.join(process.cwd(), 'public', 'assets', 'uploads', 'cvs')
    await fs.mkdir(dir, { recursive: true })
    const buffer   = Buffer.from(await cvFile.arrayBuffer())
    await fs.writeFile(path.join(dir, filename), buffer)
    resumeUrl = `/assets/uploads/cvs/${filename}`
  }

  // Save to DB
  try {
    await db.jobApplication.create({
      data: {
        name,
        email,
        phone,
        role,
        department: jobId,
        resumeUrl,
        linkedinUrl,
        portfolioUrl,
        coverLetter,
        status: 'RECEIVED',
      },
    })
  } catch (err) {
    console.error('[Careers Apply] DB error:', err)
  }

  // Send email notification
  try {
    const toEmail = process.env.CONTACT_EMAIL || SITE_CONFIG.email
    const rows = [
      { label: 'Name',      value: name,  href: undefined },
      { label: 'Email',     value: email, href: `mailto:${email}` },
      { label: 'Role',      value: role },
      ...(phone       ? [{ label: 'Phone',     value: phone }] : []),
      ...(linkedinUrl ? [{ label: 'LinkedIn',  value: linkedinUrl,  href: linkedinUrl  }] : []),
      ...(portfolioUrl? [{ label: 'Portfolio', value: portfolioUrl, href: portfolioUrl }] : []),
      ...(resumeUrl   ? [{ label: 'CV',        value: 'Download CV', href: `${SITE_CONFIG.url}${resumeUrl}` }] : []),
    ]
    await sendResendEmail({
      to: toEmail,
      replyTo: email,
      subject: `New Job Application — ${role} (${name})`,
      html: buildEmailHtml({
        heading: 'New Job Application',
        rows,
        body: coverLetter ?? undefined,
        footer: `View all applications at ${SITE_CONFIG.url}/admin/applications`,
      }),
    })
  } catch (err) {
    console.error('[Careers Apply] Email error:', err)
  }

  return NextResponse.json({ success: true })
}
