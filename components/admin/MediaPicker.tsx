'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Loader2, ImageIcon } from 'lucide-react'
import { MediaGrid } from './MediaGrid'
import type { MediaFile } from '@/lib/media-types'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  title?: string
}

export function MediaPicker({ open, onClose, onSelect, title = 'Select Media' }: Props) {
  const [files, setFiles]     = useState<MediaFile[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/media/list')
      if (!res.ok) throw new Error('Failed to load media')
      const data = await res.json()
      setFiles(data.files ?? [])
      setFolders(data.folders ?? [])
    } catch {
      setError('Could not load media library.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) load()
  }, [open, load])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  function handleSelect(url: string) {
    onSelect(url)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-slate-800">{title}</h2>
            {files.length > 0 && (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{files.length} files</span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <Loader2 size={22} className="animate-spin mr-2" /> Loading media…
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-slate-500">{error}</p>
              <button onClick={load} className="text-sm text-indigo-600 hover:underline">Try again</button>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
              <ImageIcon size={36} className="text-slate-200" />
              <p className="text-sm">No files uploaded yet.</p>
              <p className="text-xs">Upload files from the Media Library page.</p>
            </div>
          ) : (
            <MediaGrid
              files={files}
              allFolders={folders}
              mode="picker"
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
          <p className="text-xs text-slate-400">Click a file to insert it. Open folders to browse.</p>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  )
}
