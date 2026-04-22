import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createCaseStudy } from '@/lib/admin/case-study-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const ta = ic + ' resize-y'

const INDUSTRIES = ['Technology','Financial Services','Healthcare','Retail','Manufacturing','Government','Education','Telecom','Energy','Logistics','Other']

export default async function NewCaseStudyPage() {
  const session = await auth()
  return (
    <>
      <AdminTopBar title="New Case Study" user={session!.user} />
      <div className="p-6 max-w-3xl">
        <Link href="/admin/case-studies" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5">
          <ChevronLeft size={16} /> Back
        </Link>
        <form action={createCaseStudy} className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input name="title" type="text" required placeholder="Cloud Migration Success Story" className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input name="slug" type="text" placeholder="auto-generated from title" className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client <span className="text-red-500">*</span></label>
                <input name="client" type="text" required placeholder="Acme Corp" className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry <span className="text-red-500">*</span></label>
                <select name="industry" required className={ic}>
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Related Service</label>
                <input name="service" type="text" placeholder="Cloud Solutions" className={ic} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Summary <span className="text-red-500">*</span></label>
              <textarea name="summary" required rows={2} placeholder="One-paragraph summary shown on listing cards" className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
              <input name="imageUrl" type="url" placeholder="https://..." className={ic} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Case Study Content</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Challenge <span className="text-red-500">*</span></label>
              <textarea name="challenge" required rows={4} placeholder="What problem did the client face?" className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Solution <span className="text-red-500">*</span></label>
              <textarea name="solution" required rows={4} placeholder="How did Orion eSolutions solve it?" className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Results <span className="text-red-500">*</span></label>
              <textarea name="results" required rows={4} placeholder="Measurable outcomes and benefits" className={ta} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input name="sortOrder" type="number" defaultValue={0} min={0} className={ic} />
              </div>
              <div className="flex items-end gap-4 pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="published" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="featured" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Featured</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Create</button>
            <Link href="/admin/case-studies" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
