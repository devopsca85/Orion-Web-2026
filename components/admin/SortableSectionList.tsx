'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  GripVertical, Eye, EyeOff, CheckCircle, Pencil, ChevronUp, ChevronDown,
} from 'lucide-react'
import { saveSectionLayout } from '@/lib/admin/page-section-actions'

export type SectionMeta = {
  key: string
  label: string
  visible: boolean
  description?: string
  editHref?: string
  icon?: string
}

interface Props {
  page: 'home' | 'footer'
  initialSections: SectionMeta[]
}

const EMOJI: Record<string, string> = {
  hero: '🏠', 'client-logos': '🤝', stats: '📊', 'services-grid': '⚙️',
  features: '✨', 'tech-stack': '💻', 'engagement-models': '🔄',
  portfolio: '🗂️', testimonials: '💬', awards: '🏆', faq: '❓',
  blog: '📝', cta: '🚀', countries: '🌍', links: '🔗',
  newsletter: '📧', bottombar: '📄',
}

export function SortableSectionList({ page, initialSections }: Props) {
  const [sections, setSections] = useState<SectionMeta[]>(initialSections)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const dragItemRef = useRef<number | null>(null)

  function handleDragStart(i: number) { dragItemRef.current = i; setDragIdx(i) }
  function handleDragOver(e: React.DragEvent, i: number) { e.preventDefault(); setOverIdx(i) }
  function handleDrop(e: React.DragEvent, i: number) {
    e.preventDefault()
    const from = dragItemRef.current
    if (from === null || from === i) { setDragIdx(null); setOverIdx(null); return }
    setSections(prev => {
      const next = [...prev]; const [moved] = next.splice(from, 1); next.splice(i, 0, moved); return next
    })
    dragItemRef.current = null; setDragIdx(null); setOverIdx(null)
  }
  function handleDragEnd() { dragItemRef.current = null; setDragIdx(null); setOverIdx(null) }

  function moveUp(i: number) {
    if (i === 0) return
    setSections(prev => { const n = [...prev]; [n[i-1], n[i]] = [n[i], n[i-1]]; return n })
  }
  function moveDown(i: number) {
    if (i === sections.length - 1) return
    setSections(prev => { const n = [...prev]; [n[i], n[i+1]] = [n[i+1], n[i]]; return n })
  }
  function toggleVisible(i: number) {
    setSections(prev => prev.map((s, idx) => idx === i ? { ...s, visible: !s.visible } : s))
  }

  async function handleSave() {
    setSaving(true); setError(null)
    try {
      await saveSectionLayout(page, sections)
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {sections.map((section, i) => {
          const isDragging = dragIdx === i
          const isOver = overIdx === i && dragIdx !== i
          const emoji = EMOJI[section.key] ?? '📌'
          return (
            <li
              key={section.key}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={e => handleDrop(e, i)}
              onDragEnd={handleDragEnd}
              className={[
                'flex items-center gap-3 rounded-xl border px-4 py-3 select-none transition-all',
                isDragging ? 'opacity-40 border-indigo-300 bg-indigo-50' :
                isOver    ? 'border-indigo-400 bg-indigo-50 shadow-md' :
                section.visible ? 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm' :
                'border-slate-100 bg-slate-50',
              ].join(' ')}
            >
              {/* Drag handle */}
              <span className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0" title="Drag to reorder">
                <GripVertical size={18} />
              </span>

              {/* Emoji icon */}
              <span className={`text-xl shrink-0 ${!section.visible ? 'opacity-40' : ''}`}>{emoji}</span>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight ${section.visible ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                  {section.label}
                </p>
                {section.description && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{section.description}</p>
                )}
              </div>

              {/* Order badge */}
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5 shrink-0">
                #{i + 1}
              </span>

              {/* Move up/down (mobile-friendly fallback for drag) */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => moveUp(i)} disabled={i === 0} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20">
                  <ChevronUp size={13} />
                </button>
                <button onClick={() => moveDown(i)} disabled={i === sections.length - 1} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20">
                  <ChevronDown size={13} />
                </button>
              </div>

              {/* Edit content link */}
              {section.editHref && (
                <Link
                  href={section.editHref}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                >
                  <Pencil size={11} /> Edit
                </Link>
              )}

              {/* Visible toggle */}
              <button
                type="button"
                onClick={() => toggleVisible(i)}
                title={section.visible ? 'Hide on page' : 'Show on page'}
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${section.visible ? 'text-indigo-500 hover:bg-indigo-50' : 'text-slate-300 hover:bg-slate-100'}`}
              >
                {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {saved && <CheckCircle size={15} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Layout'}
        </button>
        <p className="text-xs text-slate-400">Changes apply immediately after saving.</p>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  )
}
