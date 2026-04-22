import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { SortableSectionList, SectionMeta } from '@/components/admin/SortableSectionList'
import { getPageSections } from '@/lib/page-sections'
import { Info, ExternalLink } from 'lucide-react'
import Link from 'next/link'

/* Edit links and descriptions for each section key */
const SECTION_META: Record<string, { description: string; editHref: string }> = {
  'hero':               { description: 'Main banner — headline, subtitle, CTA button and background image',      editHref: '/admin/home?tab=hero' },
  'client-logos':       { description: 'Scrolling strip of client/partner logos',                               editHref: '/admin/client-logos' },
  'stats':              { description: 'Key numbers bar — years, clients, projects, countries',                  editHref: '/admin/home/stats' },
  'services-grid':      { description: 'Cards showcasing your service offerings',                               editHref: '/admin/services' },
  'features':           { description: '"Why Us" section — benefits and commitment items',                      editHref: '/admin/features' },
  'tech-stack':         { description: 'Technology logos grouped by category',                                  editHref: '/admin/tech-stack' },
  'engagement-models':  { description: 'How clients work with you — Fixed Price, T&M, Retainer, etc.',          editHref: '/admin/engagement-models' },
  'portfolio':          { description: 'Featured project/case study cards',                                     editHref: '/admin/portfolio' },
  'testimonials':       { description: 'Client quotes and star ratings',                                        editHref: '/admin/testimonials' },
  'awards':             { description: 'Awards and recognition logos/badges',                                   editHref: '/admin/awards' },
  'faq':                { description: 'Frequently asked questions accordion',                                   editHref: '/admin/faqs' },
  'blog':               { description: 'Latest blog post preview cards',                                        editHref: '/admin/blog' },
  'cta':                { description: 'Bottom call-to-action block — book a call, get a quote',               editHref: '/admin/home?tab=cta' },
}

export default async function HomeSectionsPage() {
  const session = await auth()
  const sections = await getPageSections('home')

  const enriched: SectionMeta[] = sections.map(s => ({
    key:         s.key,
    label:       s.label,
    visible:     s.visible,
    description: SECTION_META[s.key]?.description,
    editHref:    SECTION_META[s.key]?.editHref,
  }))

  const visibleCount = enriched.filter(s => s.visible).length

  return (
    <>
      <AdminTopBar title="Page Manager — Home" user={session!.user} />
      <div className="p-6 max-w-3xl space-y-6">

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-slate-800">{enriched.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Sections</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-green-600">{visibleCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Visible on Page</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-slate-400">{enriched.length - visibleCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Hidden</p>
          </div>
        </div>

        {/* How-to tip */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>
            <strong>How to use:</strong> Drag rows to reorder sections on the live page. Click the 👁 eye to show or hide a section.
            Click <strong>Edit</strong> to change that section&apos;s content. Hit <strong>Save Layout</strong> when done.
          </span>
        </div>

        {/* Section list */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800">Home Page Sections</h2>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ExternalLink size={12} /> View live page
            </Link>
          </div>
          <SortableSectionList page="home" initialSections={enriched} />
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(SECTION_META).map(([key, meta]) => (
              <Link
                key={key}
                href={meta.editHref}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors"
              >
                <span>{SECTION_EMOJI[key] ?? '📌'}</span>
                {sections.find(s => s.key === key)?.label ?? key}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

const SECTION_EMOJI: Record<string, string> = {
  hero: '🏠', 'client-logos': '🤝', stats: '📊', 'services-grid': '⚙️',
  features: '✨', 'tech-stack': '💻', 'engagement-models': '🔄',
  portfolio: '🗂️', testimonials: '💬', awards: '🏆', faq: '❓',
  blog: '📝', cta: '🚀',
}
