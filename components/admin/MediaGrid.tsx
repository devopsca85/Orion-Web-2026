'use client'

import { useState, useEffect } from 'react'
import { Check, Copy, Folder, FolderOpen, ChevronRight, ZoomIn, X, Search } from 'lucide-react'

interface MediaFile {
  name: string
  path: string
  folder: string
  ext: string
}

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.ico'])

const extBadge: Record<string, string> = {
  svg:  'bg-orange-50 text-orange-600',
  png:  'bg-blue-50 text-blue-600',
  jpg:  'bg-green-50 text-green-700',
  jpeg: 'bg-green-50 text-green-700',
  webp: 'bg-violet-50 text-violet-600',
  gif:  'bg-pink-50 text-pink-600',
  avif: 'bg-teal-50 text-teal-600',
  ico:  'bg-slate-100 text-slate-500',
}

export function MediaGrid({ files }: { files: MediaFile[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [copied, setCopied]     = useState<string | null>(null)
  const [preview, setPreview]   = useState<MediaFile | null>(null)
  const [search, setSearch]     = useState('')

  const folders = Array.from(new Set(files.map((f) => f.folder))).sort()

  const query = search.trim().toLowerCase()
  const filtered = query
    ? files.filter((f) => f.name.toLowerCase().includes(query) || f.path.toLowerCase().includes(query))
    : null

  function toggleFolder(folder: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(folder)) { next.delete(folder) } else { next.add(folder) }
      return next
    })
  }

  function copyPath(path: string) {
    navigator.clipboard.writeText(path)
    setCopied(path)
    setTimeout(() => setCopied(null), 2000)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (files.length === 0) {
    return <p className="text-slate-400 text-center py-12">No image files found in public/assets/images.</p>
  }

  function FileRow({ file }: { file: MediaFile }) {
    const isCopied   = copied === file.path
    const canPreview = imageExts.has(file.ext.toLowerCase())
    const extKey     = file.ext.replace('.', '').toLowerCase()
    const badge      = extBadge[extKey] ?? 'bg-slate-100 text-slate-500'

    return (
      <tr className="hover:bg-slate-50/80 group transition-colors">
        <td className="px-4 py-2.5 font-medium text-slate-800 max-w-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="truncate text-sm" title={file.name}>{file.name}</span>
            {canPreview && (
              <button
                onClick={() => setPreview(file)}
                title="Preview image"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-indigo-500"
              >
                <ZoomIn size={14} />
              </button>
            )}
          </div>
        </td>
        <td className="px-4 py-2.5">
          <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono font-semibold uppercase ${badge}`}>
            {extKey}
          </span>
        </td>
        <td className="px-4 py-2.5 text-slate-400 font-mono text-xs max-w-sm">
          <span className="truncate block" title={file.path}>{file.path}</span>
        </td>
        <td className="px-4 py-2.5 text-center">
          <button
            onClick={() => copyPath(file.path)}
            title={isCopied ? 'Copied!' : 'Copy path'}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {isCopied
              ? <Check size={13} className="text-green-500" />
              : <Copy size={13} />}
          </button>
        </td>
      </tr>
    )
  }

  function TableHead() {
    return (
      <thead>
        <tr className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
          <th className="text-left px-4 py-2.5 font-medium">File</th>
          <th className="text-left px-4 py-2.5 font-medium">Type</th>
          <th className="text-left px-4 py-2.5 font-medium">Public Path</th>
          <th className="px-4 py-2.5 font-medium">Copy</th>
        </tr>
      </thead>
    )
  }

  return (
    <>
      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search files or paths…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Search results (flat) ───────────────────────────────── */}
      {filtered ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <TableHead />
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                    No files match &ldquo;{search}&rdquo;
                  </td>
                </tr>
              ) : (
                filtered.map((f) => <FileRow key={f.path} file={f} />)
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── Folder accordion ────────────────────────────────────── */
        <div className="space-y-2">
          {folders.map((folder) => {
            const folderFiles  = files.filter((f) => f.folder === folder)
            const isOpen       = expanded.has(folder)
            const imageCount   = folderFiles.filter((f) => imageExts.has(f.ext.toLowerCase())).length

            return (
              <div key={folder} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Folder header */}
                <button
                  onClick={() => toggleFolder(folder)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight
                    size={15}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                  {isOpen
                    ? <FolderOpen size={18} className="text-amber-400 shrink-0" />
                    : <Folder     size={18} className="text-amber-400 shrink-0" />}
                  <span className="font-semibold text-sm text-slate-700 flex-1 truncate">
                    {folder || 'root'}
                  </span>
                  <span className="text-xs text-slate-400 shrink-0">
                    {folderFiles.length} file{folderFiles.length !== 1 ? 's' : ''}
                    {imageCount > 0 && (
                      <span className="ml-2 bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-medium">
                        {imageCount} image{imageCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </span>
                </button>

                {/* File table */}
                {isOpen && (
                  <div className="border-t border-slate-100">
                    <table className="w-full text-sm">
                      <TableHead />
                      <tbody className="divide-y divide-slate-100">
                        {folderFiles.map((f) => <FileRow key={f.path} file={f} />)}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Preview Modal ───────────────────────────────────────── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate text-sm">{preview.name}</p>
                <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{preview.path}</p>
              </div>
              <button
                onClick={() => copyPath(preview.path)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors shrink-0"
              >
                {copied === preview.path
                  ? <><Check size={12} className="text-green-500" /> Copied</>
                  : <><Copy size={12} /> Copy path</>}
              </button>
              <button
                onClick={() => setPreview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-6 bg-[#f8f8f8] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.path}
                alt={preview.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono font-semibold uppercase ${extBadge[preview.ext.replace('.','').toLowerCase()] ?? 'bg-slate-100 text-slate-500'}`}>
                {preview.ext.replace('.', '')}
              </span>
              <span className="text-xs text-slate-400">Click outside or press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
