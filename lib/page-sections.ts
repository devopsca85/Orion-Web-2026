import { prisma } from '@/lib/prisma'

export type SectionConfig = {
  key: string
  label: string
  sortOrder: number
  visible: boolean
}

export const HOME_SECTION_DEFAULTS = [
  { key: 'hero',              label: 'Hero' },
  { key: 'client-logos',     label: 'Client Logos' },
  { key: 'stats',            label: 'Stats' },
  { key: 'services-grid',    label: 'Services Grid' },
  { key: 'features',         label: 'Features' },
  { key: 'tech-stack',       label: 'Tech Stack' },
  { key: 'engagement-models',label: 'Engagement Models' },
  { key: 'portfolio',        label: 'Portfolio' },
  { key: 'testimonials',     label: 'Testimonials' },
  { key: 'awards',           label: 'Awards' },
  { key: 'faq',              label: 'FAQ' },
  { key: 'blog',             label: 'Blog' },
  { key: 'cta',              label: 'Call to Action' },
]

export const FOOTER_SECTION_DEFAULTS = [
  { key: 'countries',   label: 'Countries Strip' },
  { key: 'links',       label: 'Link Columns' },
  { key: 'newsletter',  label: 'Newsletter' },
  { key: 'bottombar',   label: 'Bottom Bar' },
]

export async function getPageSections(page: 'home' | 'footer'): Promise<SectionConfig[]> {
  const defaults = page === 'home' ? HOME_SECTION_DEFAULTS : FOOTER_SECTION_DEFAULTS
  try {
    const rows = await prisma.pageSection.findMany({
      where: { page },
      orderBy: { sortOrder: 'asc' },
    })
    if (rows.length === 0) {
      return defaults.map((s, i) => ({ ...s, sortOrder: i, visible: true }))
    }
    const dbMap = new Map(rows.map((r) => [r.sectionKey, r]))
    const result: SectionConfig[] = rows.map((r) => ({
      key: r.sectionKey,
      label: r.label,
      sortOrder: r.sortOrder,
      visible: r.visible,
    }))
    // Append any defaults not yet persisted (new sections added after initial save)
    defaults.forEach((d, i) => {
      if (!dbMap.has(d.key)) {
        result.push({ key: d.key, label: d.label, sortOrder: 1000 + i, visible: true })
      }
    })
    return result
  } catch {
    return defaults.map((s, i) => ({ ...s, sortOrder: i, visible: true }))
  }
}
