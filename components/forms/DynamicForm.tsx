'use client'

import { useRef, useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'

interface FieldConfig {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
}

interface FormConfig {
  id: string
  title: string
  description?: string | null
  fields: FieldConfig[]
  submitLabel: string
  successMsg: string
}

interface Props {
  form: FormConfig
}

export function DynamicForm({ form }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError]   = useState('')
  const loadedAt            = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const raw = new FormData(e.currentTarget)
    const data: Record<string, string | boolean> = {}
    for (const field of form.fields) {
      if (field.type === 'checkbox') {
        data[field.name] = raw.get(field.name) === 'on'
      } else {
        data[field.name] = (raw.get(field.name) as string) ?? ''
      }
    }
    const _hp = raw.get('_hp') as string

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: form.id, data, _hp, _ts: loadedAt.current }),
      })
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
        <p className="text-green-800 font-medium">{form.successMsg}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
      {form.title && <h2 className="text-xl font-bold text-gray-900 mb-1">{form.title}</h2>}
      {form.description && <p className="text-sm text-gray-500 mb-5">{form.description}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Honeypot — invisible to humans, filled by bots */}
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />
        {form.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                required={field.required}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">— Select —</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <input type="checkbox" name={field.name} id={field.name} className="rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor={field.name} className="text-sm text-gray-600">{field.placeholder || field.label}</label>
              </div>
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>
        ))}

        {status === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : form.submitLabel}
        </button>
      </form>
    </div>
  )
}
