import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createTechStack } from '@/lib/admin/tech-stack-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

const categories = ['Frontend', 'Backend', 'Cloud', 'Database', 'DevOps', 'Mobile', 'AI & ML', 'Security', 'Other']

export default async function NewTechStackPage() {
  const session = await auth()
  return (
    <>
      <AdminTopBar title="New Technology" user={session!.user} />
      <div className="p-6 max-w-xl">
        <Link href="/admin/tech-stack" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5"><ChevronLeft size={16} /> Back</Link>
        <form action={createTechStack} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Technology Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input id="name" name="name" type="text" required placeholder="React" className={ic} />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select id="category" name="category" className={ic}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Logo URL <span className="text-red-500">*</span></label>
              <input id="logoUrl" name="logoUrl" type="text" required placeholder="https://cdn.simpleicons.org/react or /assets/tech/react.svg" className={ic} />
              <p className="text-xs text-slate-400 mt-1">Tip: Use <strong>cdn.simpleicons.org/[name]</strong> for free tech logos.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} className={ic} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="active" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Create</button>
            <Link href="/admin/tech-stack" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
