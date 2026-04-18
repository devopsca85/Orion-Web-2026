'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'

interface FieldConfig {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string
}

interface Props {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    name?: string
    slug?: string
    title?: string
    description?: string
    fields?: string
    submitLabel?: string
    successMsg?: string
    notifyEmail?: string
    active?: boolean
  }
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
]

function parseFields(raw?: string): FieldConfig[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((f: FieldConfig & { options?: string[] | string }) => ({
      ...f,
      options: Array.isArray(f.options) ? f.options.join('\n') : (f.options ?? ''),
    }))
  } catch {
    return []
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

export function FormBuilder({ action, defaultValues }: Props) {
  const [fields, setFields] = useState<FieldConfig[]>(parseFields(defaultValues?.fields))
  const [formName, setFormName] = useState(defaultValues?.name ?? '')
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')

  function addField() {
    setFields((prev) => [...prev, { name: '', label: '', type: 'text', required: false, placeholder: '', options: '' }])
  }

  function removeField(idx: number) {
    setFields((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateField(idx: number, key: keyof FieldConfig, value: string | boolean) {
    setFields((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: value }
      if (key === 'label' && !next[idx].name) {
        next[idx].name = slugify(value as string).replace(/-/g, '_')
      }
      return next
    })
  }

  function buildFieldsJson(): string {
    return JSON.stringify(
      fields.map((f) => ({
        name: f.name,
        label: f.label,
        type: f.type,
        required: f.required,
        placeholder: f.placeholder || undefined,
        options: f.type === 'select' && f.options
          ? f.options.split('\n').map((o) => o.trim()).filter(Boolean)
          : undefined,
      }))
    )
  }

  function handleNameChange(v: string) {
    setFormName(v)
    if (!defaultValues?.slug) setSlug(slugify(v))
  }

  return (
    <form
      action={action}
      className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100"
    >
      {/* Hidden field for serialised field config */}
      <input type="hidden" name="fields" value={buildFieldsJson()} />

      {/* Meta */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Form Name (admin only) <span className="text-red-500">*</span></label>
          <input
            name="name"
            required
            value={formName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Contact Form"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug <span className="text-red-500">*</span></label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="contact-form"
          />
          <p className="text-xs text-slate-400 mt-1">Used in embed code: <code className="bg-slate-100 px-1 rounded">{`<DynamicForm slug="${slug || 'your-slug'}" />`}</code></p>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Form Title (displayed on page) <span className="text-red-500">*</span></label>
          <input name="title" required defaultValue={defaultValues?.title ?? ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Get in Touch" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea name="description" rows={2} defaultValue={defaultValues?.description ?? ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Submit Button Label</label>
          <input name="submitLabel" defaultValue={defaultValues?.submitLabel ?? 'Submit'} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notify Email</label>
          <input name="notifyEmail" type="email" defaultValue={defaultValues?.notifyEmail ?? ''} placeholder="notify@orionesolutions.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Success Message</label>
          <textarea name="successMsg" rows={2} defaultValue={defaultValues?.successMsg ?? "Thank you! We'll be in touch shortly."} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <input type="checkbox" name="active" id="active" defaultChecked={defaultValues?.active ?? true} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          <label htmlFor="active" className="text-sm text-slate-700">Active (form accepts submissions)</label>
        </div>
      </div>

      {/* Field builder */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Fields</h2>
          <button type="button" onClick={addField} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            <Plus size={15} /> Add Field
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
            No fields yet. Click &ldquo;Add Field&rdquo; to start.
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 group">
              <div className="flex items-start gap-3">
                <div className="pt-2 text-slate-300 cursor-grab shrink-0"><GripVertical size={16} /></div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Label *</label>
                    <input
                      value={field.label}
                      onChange={(e) => updateField(idx, 'label', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Name (field key) *</label>
                    <input
                      value={field.name}
                      onChange={(e) => updateField(idx, 'name', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="your_name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(idx, 'type', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Placeholder</label>
                    <input
                      value={field.placeholder ?? ''}
                      onChange={(e) => updateField(idx, 'placeholder', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  {field.type === 'select' && (
                    <div className="col-span-2 sm:col-span-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Options (one per line)</label>
                      <textarea
                        value={field.options ?? ''}
                        onChange={(e) => updateField(idx, 'options', e.target.value)}
                        rows={3}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 col-span-2 sm:col-span-4">
                    <input
                      type="checkbox"
                      id={`req-${idx}`}
                      checked={field.required}
                      onChange={(e) => updateField(idx, 'required', e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`req-${idx}`} className="text-xs text-slate-600">Required</label>
                  </div>
                </div>
                <button type="button" onClick={() => removeField(idx)} className="pt-1 text-slate-300 hover:text-red-500 transition-colors shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
        <Link href="/admin/forms" className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">Cancel</Link>
        <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">Save Form</button>
      </div>
    </form>
  )
}
