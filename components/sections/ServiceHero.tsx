'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Send, Loader2, CheckCircle, ChevronRight } from 'lucide-react'

export interface ServiceStat { value: string; label: string }

interface ServiceHeroProps {
  title: string
  highlight?: string
  badge?: string
  subtext?: string
  description: string
  stats?: ServiceStat[]
  imageUrl?: string
  serviceName?: string
  breadcrumbs?: { label: string; href?: string }[]
}

function TitleWithHighlight({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight || !title.includes(highlight)) {
    return <>{title}</>
  }
  const idx    = title.indexOf(highlight)
  const before = title.slice(0, idx)
  const after  = title.slice(idx + highlight.length)
  return <>{before}<span className="text-secondary">{highlight}</span>{after}</>
}

const DEFAULT_STATS: ServiceStat[] = [
  { value: '700+', label: 'Satisfied Clients' },
  { value: '12+',  label: 'Years of Success' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '3',    label: 'Global Locations' },
]

export function ServiceHero({
  title, highlight, badge, subtext, description, stats, imageUrl, serviceName, breadcrumbs,
}: ServiceHeroProps) {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const loadedAt     = useRef(Date.now())
  const displayStats = (stats && stats.length > 0) ? stats : DEFAULT_STATS

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('sending')
    setFormError('')
    const fd   = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd)
    try {
      const res = await fetch('/api/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, service: serviceName || title, _ts: loadedAt.current }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || 'Submission failed')
      }
      setFormState('done')
    } catch (err) {
      setFormError((err as Error).message)
      setFormState('error')
    }
  }

  return (
    <section className="bg-[#faf9f7] pt-24 pb-12 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-gray-400" />}
                {bc.href ? (
                  <Link href={bc.href} className="hover:text-primary transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-gray-700 font-medium">{bc.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

          {/* ── Left: Content ─────────────────────────────────── */}
          <div>
            {badge && (
              <div className="inline-flex flex-wrap items-center gap-2 mb-6">
                <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  AI Enabled Approach
                </span>
                <span className="border border-secondary text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {badge}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-widest">
                  Faster Development Cycles
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-gray-900 leading-tight mb-4">
              <TitleWithHighlight title={title} highlight={highlight} />
            </h1>

            {subtext && (
              <p className="text-sm font-bold text-gray-700 mb-4 tracking-wide">{subtext}</p>
            )}

            <p className="text-gray-600 leading-relaxed mb-8 max-w-xl">{description}</p>

            {/* Hero image + stats */}
            {imageUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={title} className="w-full max-w-lg rounded-2xl object-cover" />
                <div className="absolute inset-0 flex flex-wrap items-end justify-around gap-2 pb-4 pointer-events-none">
                  {displayStats.map((s) => (
                    <div key={s.label} className="bg-white rounded-full px-4 py-3 text-center shadow-md border border-gray-100 pointer-events-auto">
                      <p className="text-lg font-extrabold text-secondary leading-none">{s.value}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {displayStats.map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                    <p className="text-2xl font-extrabold text-secondary">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Inquiry form ────────────────────────────── */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl border-2 border-secondary/50 shadow-xl p-7">
              {formState === 'done' ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto mb-3 text-green-500" size={40} />
                  <h3 className="font-bold text-gray-900 mb-1">Message Received!</h3>
                  <p className="text-sm text-gray-500">Our experts will reach out to you shortly.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
                    Have A Project in Mind?
                  </h2>
                  <p className="text-sm text-gray-500 text-center mb-6">Chat with Our Experts.</p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Honeypot — hidden from humans, filled by bots */}
                    <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name" required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email" type="email" required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="phone" type="tel" required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message" required rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    {formState === 'error' && (
                      <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{formError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'sending'}
                      className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-60 uppercase tracking-wide"
                    >
                      {formState === 'sending'
                        ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                        : <><Send size={15} /> Get In Touch</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
