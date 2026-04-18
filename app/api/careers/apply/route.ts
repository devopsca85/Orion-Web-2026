import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, phone, role, jobId, linkedinUrl, portfolioUrl, coverLetter } = body

  if (!name?.trim() || !email?.trim() || !role?.trim()) {
    return NextResponse.json({ message: 'Name, email, and role are required.' }, { status: 422 })
  }

  // Save to DB
  try {
    await db.jobApplication.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        role: role.trim(),
        department: jobId || null,
        linkedinUrl: linkedinUrl?.trim() || null,
        portfolioUrl: portfolioUrl?.trim() || null,
        coverLetter: coverLetter?.trim() || null,
        status: 'RECEIVED',
      },
    })
  } catch (err) {
    console.error('[Careers Apply] DB error:', err)
  }

  // Send email notification
  try {
    const apiKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_EMAIL || SITE_CONFIG.email
    if (apiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: `${SITE_CONFIG.name} <noreply@${new URL(SITE_CONFIG.url).hostname}>`,
        to: toEmail,
        replyTo: email.trim(),
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
