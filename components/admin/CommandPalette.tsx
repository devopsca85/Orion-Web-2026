'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, Layout, Briefcase, Wrench, Loader2, Command } from 'lucide-react'

interface Result {
  id: string
  type: 'blog' | 'page' | 'portfolio' | 'service'
  title: string
  href: string
}

const typeIcon: Record<Result['type'], React.ReactNode> = {
  blog:      <FileText  size={14} className="text-blue-500 shrink-0" />,
  page:      <Layout    size={14} className="text-indigo-500 shrink-0" />,
  portfolio: <Briefcase size={14} className="text-violet-500 shrink-0" />,
  service:   <Wrench    size={14} className="text-orange-500 shrink-0" />,
}

const typeLabel: Record<Result['type'], string> = {
  blog:      'Blog Post',
  page:      'Page',
  portfolio: 'Portfolio',
  service:   'Service',
}

export function CommandPalette() {
  const [open, setOpen]         = useState(false)
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<Result[]>([])
  const [loading, setLoading]   = useState(false)
  const [selected, setSelected] = useState(0)
  const router  = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const timer    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
  }, [open])

  // Debounced search
  useEffect(() => {
    clearTimeout(timer.current)
    if (!query.trim()) { setResults([]); setLoading(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setResults(data.results ?? [])
        setSelected(0)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 220)
  }, [query])

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && results[selected]) navigate(results[selected].href)
      if (e.key === 'Escape')    close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, selected])

  function close() { setOpen(false); setQuery(''); setResults([]) }
  function navigate(href: string) { router.push(href); close() }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
      title="Search (⌘K)"
    >
      <Search size={13} />
      Search…
      <kbd className="ml-1 bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-mono">⌘K</kbd>
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4 bg-black/50 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search size={17} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, posts, services, portfolio…"
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {loading && <Loader2 size={14} className="animate-spin text-slate-400 shrink-0" />}
          <button onClick={close} className="p-1 rounded text-slate-400 hover:text-slate-600 shrink-0">
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((r, i) => (
              <li key={r.id}>
                <button
                  onClick={() => navigate(r.href)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  {typeIcon[r.type]}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                    <p className="text-xs text-slate-400">{typeLabel[r.type]}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : query && !loading ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            No results for &ldquo;{query}&rdquo;
          </div>
        ) : !query ? (
          <div className="px-4 py-5 space-y-1">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Quick navigation</p>
            {[
              { label: 'New Blog Post',    href: '/admin/blog/new' },
              { label: 'New Page',         href: '/admin/pages/new' },
              { label: 'Media Library',    href: '/admin/media' },
              { label: 'Contacts Inbox',   href: '/admin/contacts' },
            ].map((link) => (
              <button key={link.href} onClick={() => navigate(link.href)}
                className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-left">
                <Command size={13} className="text-slate-300" />
                {link.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center gap-4 text-xs text-slate-400">
          <span><kbd className="bg-white border border-slate-200 rounded px-1 font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="bg-white border border-slate-200 rounded px-1 font-mono">↵</kbd> open</span>
          <span><kbd className="bg-white border border-slate-200 rounded px-1 font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
