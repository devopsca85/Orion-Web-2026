'use server'

import { SITE_CONFIG } from '@/lib/constants'

/** Escape user-supplied strings before embedding in email HTML. */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/** Safely render a URL in an href. Only http/https/mailto are allowed. */
export function safeHref(url: string | null | undefined): string {
  if (!url) return '#'
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return escapeHtml(trimmed)
  }
  return '#'
}

export type EmailRow = { label: string; value: string; href?: string }

/** Build a standard HTML email with a table of rows. */
export function buildEmailHtml(opts: {
  heading: string
  rows: EmailRow[]
  body?: string
  footer?: string
}): string {
  const { heading, rows, body, footer } = opts
  const siteUrl = SITE_CONFIG.url

  const rowsHtml = rows
    .map(({ label, value, href }) => {
      const cell = href
        ? `<a href="${safeHref(href)}">${escapeHtml(value)}</a>`
        : escapeHtml(value)
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px;vertical-align:top">${escapeHtml(label)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${cell}</td>
      </tr>`
    })
    .join('')

  const bodyHtml = body
    ? `<div style="background:#f8fafc;border-left:4px solid #1d4ed8;padding:12px 16px;white-space:pre-wrap;margin-top:16px">${escapeHtml(body)}</div>`
    : ''

  const footerHtml = footer
    ? `<p style="color:#94a3b8;font-size:12px;margin-top:24px">${escapeHtml(footer)}</p>`
    : `<p style="color:#94a3b8;font-size:12px;margin-top:24px">Submitted via ${siteUrl}</p>`

  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#1d4ed8">${escapeHtml(heading)}</h2>
    <table style="width:100%;border-collapse:collapse">${rowsHtml}</table>
    ${bodyHtml}
    ${footerHtml}
  </div>`
}

/** Send an email via Resend. Throws if RESEND_API_KEY is missing in production. */
export async function sendResendEmail(opts: {
  to: string
  replyTo?: string
  subject: string
  html: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Email] Dev mode — skipping send:', opts.subject)
      return
    }
    throw new Error('Email service not configured')
  }
  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const from = `${SITE_CONFIG.name} <noreply@${new URL(SITE_CONFIG.url).hostname}>`
  await resend.emails.send({ from, ...opts })
}
