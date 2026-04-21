'use client'

import { useState } from 'react'
import { Send, Eye, EyeOff, FileText } from 'lucide-react'

interface Props {
  confirmedCount: number
  totalCount: number
}

interface Template {
  name: string
  subject: string
  html: string
}

const TEMPLATES: Template[] = [
  {
    name: 'Monthly Technology Insights',
    subject: 'Your Monthly Technology Insights from Orion eSolutions',
    html: `<h2 style="color:#1e3a8a;margin-top:0">Monthly Technology Insights</h2>
<p>Hi there,</p>
<p>Welcome to this month's edition of <strong>Orion eSolutions Technology Insights</strong> — your curated digest of enterprise technology trends, tips, and success stories.</p>

<h3 style="color:#1e3a8a">🚀 What's Trending This Month</h3>
<ul>
  <li><strong>AI &amp; Automation:</strong> How enterprise teams are integrating AI to reduce operational overhead by 40%.</li>
  <li><strong>Cloud Migration:</strong> Key lessons from our latest Azure migration project for a Fortune 500 client.</li>
  <li><strong>Cybersecurity:</strong> New compliance requirements every CTO should know in 2025.</li>
</ul>

<h3 style="color:#1e3a8a">💡 Tip of the Month</h3>
<p>Before your next software procurement decision, run a <strong>technology audit</strong>. Understanding your current stack gaps saves up to 30% in redundant licensing costs.</p>

<h3 style="color:#1e3a8a">📊 By the Numbers</h3>
<p>This month, our teams delivered:</p>
<ul>
  <li>12 enterprise projects across 6 countries</li>
  <li>3 cloud infrastructure migrations</li>
  <li>98.4% client satisfaction rating</li>
</ul>

<div style="background:#f0f4ff;border-left:4px solid #1e3a8a;padding:16px;border-radius:0 8px 8px 0;margin:24px 0">
  <strong style="color:#1e3a8a">Ready to transform your business?</strong><br/>
  Book a free 30-minute consultation with our technology experts — no commitment required.
</div>

<p style="text-align:center;margin:24px 0">
  <a href="https://www.orionesolutions.com/contact" style="background:#f97316;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Book a Free Consultation</a>
</p>

<p>Best regards,<br/><strong>The Orion eSolutions Team</strong></p>`,
  },
  {
    name: 'New Service Announcement',
    subject: 'Introducing Our Latest Service: [Service Name]',
    html: `<h2 style="color:#1e3a8a;margin-top:0">Exciting News — We've Launched a New Service</h2>
<p>Hi there,</p>
<p>We're thrilled to announce the launch of our newest offering — <strong>[Service Name]</strong> — designed specifically to help enterprises like yours [key benefit].</p>

<h3 style="color:#1e3a8a">What is [Service Name]?</h3>
<p>[Brief description of the service — 2-3 sentences explaining what it does and who it's for.]</p>

<h3 style="color:#1e3a8a">Key Benefits</h3>
<ul>
  <li>✅ <strong>Faster time-to-market</strong> — reduce deployment cycles by up to 50%</li>
  <li>✅ <strong>Cost efficiency</strong> — lower total cost of ownership</li>
  <li>✅ <strong>Expert support</strong> — dedicated team of certified specialists</li>
  <li>✅ <strong>Scalable</strong> — grows with your business</li>
</ul>

<h3 style="color:#1e3a8a">Early Access Offer</h3>
<p>As a valued subscriber, you're among the first to know. <strong>Book a demo before [Date]</strong> and receive a complimentary technology assessment worth $2,500.</p>

<div style="background:#fff7ed;border:1px solid #fdba74;padding:16px;border-radius:8px;margin:24px 0">
  <strong style="color:#c2410c">⏰ Limited Time:</strong> Early access pricing available until [Date]. Don't miss out.
</div>

<p style="text-align:center;margin:24px 0">
  <a href="https://www.orionesolutions.com/contact" style="background:#f97316;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Claim Your Free Demo</a>
</p>

<p>Questions? Simply reply to this email — we're here to help.</p>
<p>Best regards,<br/><strong>The Orion eSolutions Team</strong></p>`,
  },
  {
    name: 'Case Study Spotlight',
    subject: 'How [Client] Achieved [Result] with Orion eSolutions',
    html: `<h2 style="color:#1e3a8a;margin-top:0">Client Success Story: [Client Name]</h2>
<p>Hi there,</p>
<p>We love sharing our clients' wins. This month, we're spotlighting how <strong>[Client Name]</strong>, a leading [industry] company, achieved <strong>[key result]</strong> with our help.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:8px;margin:20px 0">
  <h3 style="color:#1e3a8a;margin-top:0">The Challenge</h3>
  <p>[Client] was struggling with [specific problem — e.g., legacy infrastructure limiting growth, manual processes causing delays, cybersecurity vulnerabilities].</p>

  <h3 style="color:#1e3a8a">Our Solution</h3>
  <p>We implemented [solution — e.g., a cloud-native microservices architecture, an AI-powered automation platform] that [specific action taken].</p>

  <h3 style="color:#1e3a8a">The Results</h3>
  <ul>
    <li>📈 <strong>[X]% increase</strong> in operational efficiency</li>
    <li>⏱️ <strong>[X] hours saved</strong> per week on manual processes</li>
    <li>💰 <strong>$[X] reduction</strong> in annual IT costs</li>
    <li>🚀 <strong>[X]x faster</strong> deployment cycles</li>
  </ul>
</div>

<blockquote style="border-left:4px solid #6366f1;margin:20px 0;padding:12px 16px;color:#475569;font-style:italic">
  "Working with Orion eSolutions transformed our technology strategy. The results exceeded our expectations." — [Name], [Title] at [Client]
</blockquote>

<p>Could your business achieve similar results? Let's find out.</p>

<p style="text-align:center;margin:24px 0">
  <a href="https://www.orionesolutions.com/contact" style="background:#f97316;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Get a Free Assessment</a>
</p>

<p>Best regards,<br/><strong>The Orion eSolutions Team</strong></p>`,
  },
  {
    name: 'Promotional Offer',
    subject: 'Exclusive Offer for Our Subscribers — [Offer Name]',
    html: `<div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:24px;border-radius:8px 8px 0 0;text-align:center;margin:-24px -24px 24px">
  <h2 style="color:white;margin:0;font-size:24px">Exclusive Subscriber Offer</h2>
  <p style="color:#bfdbfe;margin:8px 0 0">Valid until [Expiry Date]</p>
</div>

<p>Hi there,</p>
<p>As a valued subscriber, we're giving you <strong>exclusive access to a special offer</strong> that isn't available to the general public.</p>

<div style="background:#fff7ed;border:2px solid #f97316;padding:20px;border-radius:8px;text-align:center;margin:24px 0">
  <p style="font-size:18px;font-weight:bold;color:#c2410c;margin:0 0 8px">[Your Special Offer Here]</p>
  <p style="color:#78350f;margin:0">e.g., "30% off your first project" or "Free technology audit worth $5,000"</p>
</div>

<h3 style="color:#1e3a8a">What's included:</h3>
<ul>
  <li>✅ [Benefit 1]</li>
  <li>✅ [Benefit 2]</li>
  <li>✅ [Benefit 3]</li>
  <li>✅ [Benefit 4]</li>
</ul>

<p><strong>How to claim:</strong> Click the button below and mention this email when booking your consultation.</p>

<p style="text-align:center;margin:28px 0">
  <a href="https://www.orionesolutions.com/contact" style="background:#f97316;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">Claim Your Offer Now</a>
</p>

<p style="color:#64748b;font-size:13px">⏰ <strong>This offer expires on [Date].</strong> Don't miss out — only available to our newsletter subscribers.</p>

<p>Best regards,<br/><strong>The Orion eSolutions Team</strong></p>`,
  },
  {
    name: 'Webinar / Event Invite',
    subject: 'You\'re Invited: [Webinar Title] — [Date]',
    html: `<div style="background:#1e3a8a;padding:24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
  <p style="color:#93c5fd;margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:1px">Free Webinar</p>
  <h2 style="color:white;margin:0;font-size:22px">[Webinar Title]</h2>
  <p style="color:#bfdbfe;margin:8px 0 0">📅 [Date] at [Time] [Timezone]</p>
</div>

<p>Hi there,</p>
<p>We're excited to invite you to our upcoming free webinar: <strong>"[Webinar Title]"</strong></p>

<h3 style="color:#1e3a8a">What You'll Learn</h3>
<ul>
  <li>🎯 [Key takeaway 1]</li>
  <li>🎯 [Key takeaway 2]</li>
  <li>🎯 [Key takeaway 3]</li>
  <li>🎯 [Key takeaway 4]</li>
</ul>

<h3 style="color:#1e3a8a">Your Speakers</h3>
<p><strong>[Speaker Name]</strong>, [Title] at Orion eSolutions — [Brief bio, 1-2 sentences].</p>

<div style="background:#f0f4ff;border-left:4px solid #6366f1;padding:16px;border-radius:0 8px 8px 0;margin:20px 0">
  <strong>Event Details:</strong><br/>
  📅 Date: [Full Date]<br/>
  ⏰ Time: [Time] [Timezone]<br/>
  ⏱️ Duration: [e.g., 60 minutes including Q&amp;A]<br/>
  💻 Format: Online (Zoom / Google Meet)
</div>

<p>Spots are limited — register now to secure your place.</p>

<p style="text-align:center;margin:28px 0">
  <a href="[Registration Link]" style="background:#6366f1;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">Reserve My Spot — It's Free</a>
</p>

<p>Can't attend live? Register anyway and we'll send you the recording.</p>

<p>Best regards,<br/><strong>The Orion eSolutions Team</strong></p>`,
  },
]

export function NewsletterComposer({ confirmedCount, totalCount }: Props) {
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [segment, setSegment] = useState<'confirmed' | 'all'>('confirmed')
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [resultMsg, setResultMsg] = useState('')

  const recipientCount = segment === 'confirmed' ? confirmedCount : totalCount

  function applyTemplate(t: Template) {
    setSubject(t.subject)
    setHtml(t.html)
    setPreview(false)
  }

  async function handleSend() {
    if (!subject.trim() || !html.trim()) {
      setResultMsg('Please enter a subject and content.')
      setStatus('error')
      return
    }
    if (!confirm(`Send this newsletter to ${recipientCount} subscriber${recipientCount !== 1 ? 's' : ''}? This cannot be undone.`)) return

    setStatus('loading')
    setResultMsg('')
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html, segment }),
      })
      const data = await res.json()
      setResultMsg(data.message || (res.ok ? 'Sent!' : 'Failed.'))
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setResultMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Templates sidebar */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <FileText size={14} /> Sample Templates
          </h3>
          <div className="space-y-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => applyTemplate(t)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-200"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="xl:col-span-3 space-y-4">
        {/* Stats bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-5 py-3 flex flex-wrap gap-6 items-center text-sm text-slate-500">
          <span><span className="font-semibold text-slate-800">{confirmedCount}</span> confirmed subscribers</span>
          <span><span className="font-semibold text-slate-800">{totalCount}</span> active (incl. pending)</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
          {/* Segment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Send to</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="segment"
                  value="confirmed"
                  checked={segment === 'confirmed'}
                  onChange={() => setSegment('confirmed')}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-slate-700">Confirmed only <span className="text-slate-400">({confirmedCount})</span></span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="segment"
                  value="all"
                  checked={segment === 'all'}
                  onChange={() => setSegment('all')}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-slate-700">All active <span className="text-slate-400">({totalCount})</span></span>
              </label>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your email subject..."
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Content + Preview toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">Email content (HTML)</label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {preview ? (
              <div
                className="min-h-[480px] rounded-lg border border-slate-200 bg-white p-6 overflow-auto prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={22}
                placeholder="Paste HTML content here, or select a template from the left panel..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              />
            )}
            <p className="mt-1.5 text-xs text-slate-400">
              An unsubscribe footer is automatically appended to every email.
            </p>
          </div>

          {/* Result message */}
          {resultMsg && (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {resultMsg}
            </div>
          )}

          {/* Send button */}
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={status === 'loading' || !subject.trim() || !html.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={15} />
              {status === 'loading' ? `Sending to ${recipientCount}…` : `Send to ${recipientCount} subscriber${recipientCount !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
