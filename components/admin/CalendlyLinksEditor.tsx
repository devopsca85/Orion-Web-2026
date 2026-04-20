'use client'

import { useState, useTransition } from 'react'
import { saveCalendlyLinks } from '@/lib/admin/settings-actions'
import { Plus, Trash2, CheckCircle, Copy } from 'lucide-react'

interface CalendlyLink {
  variable: string
  url: string
}

const inputClass =
  'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export function CalendlyLinksEditor({ initialLinks }: { initialLinks: CalendlyLink[] }) {
  const [links, setLinks] = useState<CalendlyLink[]>(
    initialLinks.length > 0 ? initialLinks : [{ variable: 'contact', url: '' }]
  )
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState<string | null>(null)

  function add() {
    setLinks((prev) => [...prev, { variable: '', url: '' }])
    setSaved(false)
  }

  function remove(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  function update(index: number, field: 'variable' | 'url', value: string) {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))
    setSaved(false)
  }

  function copyKey(variable: string) {
    const key = `calendly.${variable.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}`
    navigator.clipboard.writeText(key)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function save() {
    const variables = links.map((l) => l.variable.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')).filter(Boolean)
    const duplicates = variables.filter((v, i) => variables.indexOf(v) !== i)
    if (duplicates.length > 0) {
      setError(`Duplicate variable name: "${duplicates[0]}"`)
      return
    }
    setError('')
    startTransition(async () => {
      try {
        await saveCalendlyLinks(links)
        setSaved(true)
      } catch {
        setError('Failed to save. Please try again.')
      }
    })
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle size={16} className="shrink-0" />
          Calendly settings saved.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
          <h2 className="text-base font-semibold text-slate-800">Calendly Links</h2>
          <button
            type="button"
            onClick={add}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Plus size={15} /> Add Link
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Each link gets a unique variable name. Use the setting key <code className="bg-slate-100 px-1 rounded">calendly.variable</code> to read the URL in any page or component.
        </p>

        {links.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No links yet — click Add Link above.</p>
        )}

        <div className="space-y-3">
          {links.map((link, i) => {
            const key = link.variable
              ? `calendly.${link.variable.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}`
              : null
            return (
              <div key={i} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Variable Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={link.variable}
                      onChange={(e) => update(i, 'variable', e.target.value)}
                      placeholder="contact"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Calendly URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => update(i, 'url', e.target.value)}
                      placeholder="https://calendly.com/your-name/30min"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {key ? (
                    <button
                      type="button"
                      onClick={() => copyKey(link.variable)}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      <Copy size={12} />
                      {copied === key ? 'Copied!' : `Setting key: ${key}`}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Enter a variable name to see its key</span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={isPending}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        {isPending ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  )
}
