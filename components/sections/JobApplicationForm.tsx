'use client'

import { useRef, useState } from 'react'
import { Send, Loader2, CheckCircle, Paperclip, X } from 'lucide-react'

interface Props {
  role: string
  jobId: string
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_MB = 5

export function JobApplicationForm({ role, jobId }: Props) {
  const [status, setStatus]   = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError]     = useState('')
  const [cvFile, setCvFile]   = useState<File | null>(null)
  const fileRef               = useRef<HTMLInputElement>(null)
  const loadedAt              = useRef(Date.now())

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PDF or DOCX files are accepted.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_MB} MB.`)
      e.target.value = ''
      return
    }
    setError('')
    setCvFile(file)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')

    const form = e.currentTarget
    const fd   = new FormData(form)
    fd.set('role', role)
    fd.set('jobId', jobId)
    fd.set('_ts', String(loadedAt.current))
    if (cvFile) fd.set('cv', cvFile)

    try {
      const res = await fetch('/api/careers/apply', { method: 'POST', body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || 'Submission failed')
      }
      setStatus('done')
    } catch (err) {
      setError((err as Error).message)
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-3 text-green-500" size={36} />
        <h3 className="font-bold text-green-800 mb-1">Application Received!</h3>
        <p className="text-sm text-green-700">Thank you for applying. We&apos;ll review your application and be in touch shortly.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Apply for this Role</h2>
      <p className="text-sm text-gray-500 mb-5">{role}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot — invisible to humans, filled by bots */}
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input name="name" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Jane Smith" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input name="email" type="email" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="jane@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input name="phone" type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+1 (555) 000-0000" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
          <input name="linkedinUrl" type="url" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://linkedin.com/in/…" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio / GitHub</label>
          <input name="portfolioUrl" type="url" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://github.com/…" />
        </div>

        {/* CV Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CV / Resume <span className="text-gray-400 font-normal text-xs">(PDF or DOCX, max {MAX_MB} MB)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />
          {cvFile ? (
            <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-lg px-3 py-2 text-sm">
              <Paperclip size={14} className="text-primary shrink-0" />
              <span className="flex-1 text-gray-700 truncate">{cvFile.name}</span>
              <button
                type="button"
                onClick={() => { setCvFile(null); if (fileRef.current) fileRef.current.value = '' }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 w-full border border-dashed border-gray-300 hover:border-primary rounded-lg px-3 py-3 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <Paperclip size={14} /> Click to attach CV (PDF or DOCX)
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
          <textarea name="coverLetter" rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y" placeholder="Why are you interested in this role?" />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <><Send size={16} /> Submit Application</>}
        </button>
      </form>
    </div>
  )
}
