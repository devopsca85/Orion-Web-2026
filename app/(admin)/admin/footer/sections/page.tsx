import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { SortableSectionList } from '@/components/admin/SortableSectionList'
import { getPageSections } from '@/lib/page-sections'
import { LayoutGrid, Info } from 'lucide-react'
import Link from 'next/link'

export default async function FooterSectionsPage() {
  const session = await auth()
  const sections = await getPageSections('footer')

  return (
    <>
      <AdminTopBar title="Footer — Section Layout" user={session!.user} />
      <div className="p-6 max-w-2xl space-y-6">
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>
            Drag to reorder footer sections. Hide sections you don&apos;t want to display.
            Changes apply to the live site immediately after saving.
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid size={18} className="text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-800">Footer Sections</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            {sections.length} sections configured
          </p>
          <SortableSectionList
            page="footer"
            initialSections={sections.map((s) => ({
              key: s.key,
              label: s.label,
              visible: s.visible,
            }))}
          />
        </div>

        <p className="text-xs text-slate-400">
          To edit footer content, visit{' '}
          <Link href="/admin/country-offices" className="text-indigo-600 hover:underline">
            Country Offices
          </Link>
          {' or '}
          <Link href="/admin/footer-links" className="text-indigo-600 hover:underline">
            Footer Links
          </Link>
          .
        </p>
      </div>
    </>
  )
}
