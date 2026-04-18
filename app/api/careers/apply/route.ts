import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

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
    const apiKey  = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_EMAIL || SITE_CONFIG.email
    if (apiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      const cvLink  = resumeUrl
        ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px">CV / Resume</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="${SITE_CONFIG.url}${resumeUrl}">Download CV</a></td></tr>`
        : ''
      await resend.emails.send({
        from: `${SITE_CONFIG.name} <noreply@${new URL(SITE_CONFIG.url).hostname}>`,
        to: toEmail,
        replyTo: email,
        subject: `New Job Application — ${role} (${name})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1d4ed8">New Job Application</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Role</td><td style="padding:8px;border-bottom:1px solid #eee">${role}</td></tr>
              ${phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Phone</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>` : ''}
              ${linkedinUrl ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">LinkedIn</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="${linkedinUrl}">${linkedinUrl}</a></td></tr>` : ''}
              ${portfolioUrl ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Portfolio</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="${portfolioUrl}">${portfolioUrl}</a></td></tr>` : ''}
              ${cvLink}
            </table>
            ${coverLetter ? `<h3 style="color:#1d4ed8;margin-top:16px">Cover Letter</h3><div style="background:#f8fafc;border-left:4px solid #1d4ed8;padding:12px 16px;white-space:pre-wrap">${coverLetter}</div>` : ''}
            <p style="color:#94a3b8;font-size:12px;margin-top:24px">View all applications at ${SITE_CONFIG.url}/admin/applications</p>
          </div>
        `,
      })
    }
  } catch (err) {
    console.error('[Careers Apply] Email error:', err)
  }

  return NextResponse.json({ success: true })
}
