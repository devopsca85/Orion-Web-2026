import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateCaseStudy } from '@/lib/admin/case-study-actions'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const ta = ic + ' resize-y'

const INDUSTRIES = ['Technology','Financial Services','Healthcare','Retail','Manufacturing','Government','Education','Telecom','Energy','Logistics','Other']

interface Props { params: Promise<{ id: string }> }

export default async function EditCaseStudyPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  let s: Awaited<ReturnType<typeof prisma.caseStudy.findUnique>> = null
  try {
    s = await prisma.caseStudy.findUnique({ where: { id } })
  } catch { /* table may not exist yet */ }
  if (!s) notFound()
  const action = updateCaseStudy.bind(null, id)

  return (
    <>
      <AdminTopBar title="Edit Case Study" user={session!.user} />
      <div className="p-6 max-w-3xl">
        <Link href="/admin/case-studies" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5">
          <ChevronLeft size={16} /> Back
        </Link>
        <form action={action} className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input name="title" type="text" required defaultValue={s.title} className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client <span className="text-red-500">*</span></label>
                <input name="client" type="text" required defaultValue={s.client} className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry <span className="text-red-500">*</span></label>
                <select name="industry" required defaultValue={s.industry} className={ic}>
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Related Service</label>
                <input name="service" type="text" defaultValue={s.service ?? ''} className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug <span className="text-slate-400 text-xs font-normal ml-1">— changes the URL</span></label>
                <input name="slug" type="text" defaultValue={s.slug} className={ic + ' font-mono'} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Summary <span className="text-red-500">*</span></label>
              <textarea name="summary" required rows={2} defaultValue={s.summary} className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
              <input name="imageUrl" type="url" defaultValue={s.imageUrl ?? ''} placeholder="https://..." className={ic} />
              {s.imageUrl && (
                <div className="mt-2 h-24 w-40 overflow-hidden rounded-lg border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Case Study Content</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Challenge <span className="text-red-500">*</span></label>
              <textarea name="challenge" required rows={4} defaultValue={s.challenge} className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Solution <span className="text-red-500">*</span></label>
              <textarea name="solution" required rows={4} defaultValue={s.solution} className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Results <span className="text-red-500">*</span></label>
              <textarea name="results" required rows={4} defaultValue={s.results} className={ta} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input name="sortOrder" type="number" defaultValue={s.sortOrder} min={0} className={ic} />
              </div>
              <div className="flex items-end gap-4 pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="published" type="checkbox" defaultChecked={s.published} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="featured" type="checkbox" defaultChecked={s.featured} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Featured</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            <Link href="/admin/case-studies" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
