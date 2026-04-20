'use client'

import { useState, useRef } from 'react'
import { GripVertical, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { saveSectionLayout } from '@/lib/admin/page-section-actions'

type Section = { key: string; label: string; visible: boolean }

interface Props {
  page: 'home' | 'footer'
  initialSections: Section[]
}

export function SortableSectionList({ page, initialSections }: Props) {
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const dragItemRef = useRef<number | null>(null)

  function handleDragStart(index: number) {
    dragItemRef.current = index
    setDragIdx(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    setOverIdx(index)
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault()
    const from = dragItemRef.current
    if (from === null || from === index) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }
    setSections((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      return next
    })
    dragItemRef.current = null
    setDragIdx(null)
    setOverIdx(null)
  }

  function handleDragEnd() {
    dragItemRef.current = null
    setDragIdx(null)
    setOverIdx(null)
  }

  function toggleVisible(index: number) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, visible: !s.visible } : s))
    )
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveSectionLayout(page, sections)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <ul className="space-y-2">
        {sections.map((section, index) => {
          const isDragging = dragIdx === index
          const isOver = overIdx === index && dragIdx !== index
          return (
            <li
              key={section.key}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={[
                'flex items-center gap-3 rounded-xl border px-4 py-3 select-none transition-all',
                isDragging
                  ? 'opacity-40 border-indigo-300 bg-indigo-50'
                  : isOver
                  ? 'border-indigo-400 bg-indigo-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
                !section.visible && !isDragging ? 'opacity-60' : '',
              ].join(' ')}
            >
              <span
                className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 shrink-0"
                title="Drag to reorder"
              >
                <GripVertical size={18} />
              </span>

              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-medium ${
                    section.visible ? 'text-slate-800' : 'text-slate-400 line-through'
                  }`}
                >
                  {section.label}
                </span>
              </div>

              <span className="text-xs text-slate-400 font-mono shrink-0">#{index + 1}</span>

              <button
                type="button"
                onClick={() => toggleVisible(index)}
                title={section.visible ? 'Hide section' : 'Show section'}
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                  section.visible
                    ? 'text-indigo-600 hover:bg-indigo-50'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
            saved
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {saved && <CheckCircle size={15} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Layout'}
        </button>
        <p className="text-xs text-slate-400">
          Changes apply to the live site immediately after saving.
        </p>
      </div>
    </div>
  )
}
