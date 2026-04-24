import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { updateHtmlSection } from '@/lib/admin/html-section-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

const COMMON_PAGES = ['home', 'about', 'contact', 'services', 'products', 'careers', 'portfolio']

interface Props { params: Promise<{ id: string }> }

export default async function EditHtmlSectionPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  let section
  try { section = await prisma.htmlSection.findUnique({ where: { id } }) } catch { section = null }
  if (!section) notFound()

  const action = updateHtmlSection.bind(null, id)

  return (
    <>
      <AdminTopBar title="Edit HTML Section" user={session!.user} />
      <div className="p-6 max-w-5xl">
        <Link href="/admin/sections" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Sections
        </Link>

        <form action={action} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg border-b border-slate-100 pb-3">Section Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Section Name <span className="text-red-500">*</span>
                </label>
                <input name="name" type="text" required defaultValue={section.name} className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Page <span className="text-red-500">*</span>
                </label>
                <input
                  name="pageSlug"
                  type="text"
                  required
                  defaultValue={section.pageSlug}
                  list="page-suggestions"
                  className={ic}
                />
                <datalist id="page-suggestions">
                  {COMMON_PAGES.map(p => <option key={p} value={p} />)}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input name="sortOrder" type="number" defaultValue={section.sortOrder} min={0} className={ic} style={{ maxWidth: 120 }} />
                <p className="text-xs text-slate-400 mt-1">Lower numbers render first on the page.</p>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="active" type="checkbox" defaultChecked={section.active} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Active (visible on site)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
            <div>
              <h2 className="font-semibold text-slate-800 text-lg">HTML Content</h2>
              <p className="text-xs text-slate-400 mt-1">
                Edit the HTML for this section. Inline <code>&lt;style&gt;</code> blocks are supported.
              </p>
            </div>
            <RichTextEditor name="html" content={section.html} minHeight="500px" defaultSourceMode />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
            <Link href="/admin/sections" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
