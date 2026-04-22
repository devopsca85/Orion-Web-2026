import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { HeroImageInput } from '@/components/admin/HeroImageInput'
import { getSettings } from '@/lib/settings'
import { saveHomeSettings } from '@/lib/admin/settings-actions'
import { CheckCircle, BarChart2, Layout, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ saved?: string; tab?: string }>
}

const inputClass = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const textareaClass = inputClass + ' resize-y'

function SectionHeaderFields({ prefix, s }: { prefix: string; s: Record<string, string> }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Eyebrow</label>
        <input name={`${prefix}.eyebrow`} type="text" defaultValue={s[`${prefix}.eyebrow`] || ''} placeholder="e.g. What We Do" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
        <input name={`${prefix}.title`} type="text" defaultValue={s[`${prefix}.title`] || ''} placeholder="Section headline" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
        <textarea name={`${prefix}.description`} rows={2} defaultValue={s[`${prefix}.description`] || ''} placeholder="Short subtitle under the headline" className={textareaClass} />
      </div>
    </div>
  )
}

export default async function HomeAdminPage({ searchParams }: Props) {
  const session = await auth()
  const { saved, tab = 'hero' } = await searchParams

  const settings = await getSettings([
    'home.hero.eyebrow', 'home.hero.title', 'home.hero.highlight', 'home.hero.description',
    'home.hero.primaryCtaLabel', 'home.hero.primaryCtaHref',
    'home.hero.secondaryCtaLabel', 'home.hero.secondaryCtaHref',
    'home.hero.bullet1', 'home.hero.bullet2', 'home.hero.bullet3',
    'home.hero.backgroundImage', 'home.hero.overlayOpacity', 'home.hero.height', 'home.hero.imagePosition',
    'home.services.eyebrow', 'home.services.title', 'home.services.description',
    'home.portfolio.eyebrow', 'home.portfolio.title', 'home.portfolio.description',
    'home.blog.eyebrow', 'home.blog.title', 'home.blog.description',
    'home.features.eyebrow', 'home.features.title', 'home.features.description',
    'home.cta.title', 'home.cta.description',
    'home.cta.primaryLabel', 'home.cta.primaryHref',
    'home.cta.secondaryLabel', 'home.cta.secondaryHref',
  ])

  const tabs = [
    { key: 'hero',     label: 'Hero',            icon: <Layout size={14} /> },
    { key: 'sections', label: 'Section Headers',  icon: <BarChart2 size={14} /> },
    { key: 'cta',      label: 'CTA Block',        icon: <Zap size={14} /> },
  ]

  return (
    <>
      <AdminTopBar title="Home Page" user={session!.user} />
      <div className="p-6 max-w-3xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" /> Home page settings saved.
          </div>
        )}

        {/* Page Manager banner */}
        <Link href="/admin/home/sections" className="flex items-center justify-between gap-3 mb-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-4 transition-colors group">
          <div>
            <p className="font-semibold text-sm">Page Manager</p>
            <p className="text-xs text-indigo-200 mt-0.5">Drag to reorder sections, show/hide, and jump straight to edit any section</p>
          </div>
          <ArrowRight size={18} className="shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Quick links */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/admin/home/stats" className="flex items-center gap-1.5 text-xs text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50">
            <BarChart2 size={12} /> Edit Stats Bar
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/admin/home?tab=${t.key}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                tab === t.key ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.icon} {t.label}
            </Link>
          ))}
        </div>

        <form action={saveHomeSettings} className="space-y-6">
          {/* Hidden fields for inactive tabs so they don't get cleared on save */}
          {tab !== 'hero' && (
            <>
              {['home.hero.eyebrow','home.hero.title','home.hero.highlight','home.hero.description',
                'home.hero.primaryCtaLabel','home.hero.primaryCtaHref','home.hero.secondaryCtaLabel','home.hero.secondaryCtaHref',
                'home.hero.bullet1','home.hero.bullet2','home.hero.bullet3',
                'home.hero.backgroundImage','home.hero.overlayOpacity','home.hero.height','home.hero.imagePosition',
              ].map((k) => <input key={k} type="hidden" name={k} value={settings[k] || ''} />)}
            </>
          )}
          {tab !== 'sections' && (
            <>
              {['home.services.eyebrow','home.services.title','home.services.description',
                'home.portfolio.eyebrow','home.portfolio.title','home.portfolio.description',
                'home.blog.eyebrow','home.blog.title','home.blog.description',
                'home.features.eyebrow','home.features.title','home.features.description',
              ].map((k) => <input key={k} type="hidden" name={k} value={settings[k] || ''} />)}
            </>
          )}
          {tab !== 'cta' && (
            <>
              {['home.cta.title','home.cta.description','home.cta.primaryLabel','home.cta.primaryHref','home.cta.secondaryLabel','home.cta.secondaryHref',
              ].map((k) => <input key={k} type="hidden" name={k} value={settings[k] || ''} />)}
            </>
          )}

          {/* ── HERO TAB ── */}
          {tab === 'hero' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
              <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">Hero Section</h2>

              <div className="pb-4 border-b border-slate-100">
                <HeroImageInput
                  defaultUrl={settings['home.hero.backgroundImage'] || ''}
                  defaultOpacity={settings['home.hero.overlayOpacity'] || '0.65'}
                  defaultHeight={settings['home.hero.height'] || '100vh'}
                  defaultPosition={settings['home.hero.imagePosition'] || 'center center'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Eyebrow Label</label>
                <input name="home.hero.eyebrow" type="text" defaultValue={settings['home.hero.eyebrow'] || ''} placeholder="Enterprise Technology Partner" className={inputClass} />
                <p className="text-xs text-slate-400 mt-1">Small badge text above the headline.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                  <input name="home.hero.title" type="text" defaultValue={settings['home.hero.title'] || ''} placeholder="Transforming Business Through" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Highlighted Word</label>
                  <input name="home.hero.highlight" type="text" defaultValue={settings['home.hero.highlight'] || ''} placeholder="Technology" className={inputClass} />
                  <p className="text-xs text-slate-400 mt-1">Shown in accent colour.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="home.hero.description" rows={3} defaultValue={settings['home.hero.description'] || ''} placeholder="Orion eSolutions delivers…" className={textareaClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Button Label</label>
                  <input name="home.hero.primaryCtaLabel" type="text" defaultValue={settings['home.hero.primaryCtaLabel'] || ''} placeholder="Get a Free Consultation" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Button Link</label>
                  <input name="home.hero.primaryCtaHref" type="text" defaultValue={settings['home.hero.primaryCtaHref'] || ''} placeholder="/contact" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Button Label</label>
                  <input name="home.hero.secondaryCtaLabel" type="text" defaultValue={settings['home.hero.secondaryCtaLabel'] || ''} placeholder="View Our Work" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Button Link</label>
                  <input name="home.hero.secondaryCtaHref" type="text" defaultValue={settings['home.hero.secondaryCtaHref'] || ''} placeholder="/portfolio" className={inputClass} />
                </div>
              </div>

              <div>
                <p className="block text-sm font-medium text-slate-700 mb-2">Bullet Points (up to 3)</p>
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <input key={n} name={`home.hero.bullet${n}`} type="text" defaultValue={settings[`home.hero.bullet${n}`] || ''} placeholder={`Bullet point ${n}`} className={inputClass} />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">Leave empty to hide.</p>
              </div>
            </div>
          )}

          {/* ── SECTION HEADERS TAB ── */}
          {tab === 'sections' && (
            <div className="space-y-5">
              {[
                { prefix: 'home.services', label: 'Services Grid' },
                { prefix: 'home.portfolio', label: 'Portfolio / Case Studies' },
                { prefix: 'home.blog', label: 'Blog / Insights' },
                { prefix: 'home.features', label: 'Why Us / Features' },
              ].map(({ prefix, label }) => (
                <div key={prefix} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <ArrowRight size={14} className="text-indigo-500" /> {label}
                  </h3>
                  <SectionHeaderFields prefix={prefix} s={settings} />
                </div>
              ))}
            </div>
          )}

          {/* ── CTA TAB ── */}
          {tab === 'cta' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">Call-to-Action Block</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                <input name="home.cta.title" type="text" defaultValue={settings['home.cta.title'] || ''} placeholder="Ready to Transform Your Business?" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="home.cta.description" rows={2} defaultValue={settings['home.cta.description'] || ''} placeholder="Book a free 30-minute consultation…" className={textareaClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Button Label</label>
                  <input name="home.cta.primaryLabel" type="text" defaultValue={settings['home.cta.primaryLabel'] || ''} placeholder="Book a Free Consultation" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Button Link</label>
                  <input name="home.cta.primaryHref" type="text" defaultValue={settings['home.cta.primaryHref'] || ''} placeholder="/contact" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Button Label</label>
                  <input name="home.cta.secondaryLabel" type="text" defaultValue={settings['home.cta.secondaryLabel'] || ''} placeholder="View Case Studies" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Button Link</label>
                  <input name="home.cta.secondaryHref" type="text" defaultValue={settings['home.cta.secondaryHref'] || ''} placeholder="/portfolio" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Save Settings
          </button>
        </form>
      </div>
    </>
  )
}
