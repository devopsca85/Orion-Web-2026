import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createAward } from '@/lib/admin/award-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function NewAwardPage() {
  const session = await auth()
  const currentYear = new Date().getFullYear()
  return (
    <>
      <AdminTopBar title="New Award" user={session!.user} />
      <div className="p-6 max-w-xl">
        <Link href="/admin/awards" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5"><ChevronLeft size={16} /> Back</Link>
        <form action={createAward} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Award Details</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Award Title <span className="text-red-500">*</span></label>
              <input id="title" name="title" type="text" required placeholder="Best IT Consulting Firm" className={ic} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="issuer" className="block text-sm font-medium text-slate-700 mb-1">Issuer / Organization <span className="text-red-500">*</span></label>
                <input id="issuer" name="issuer" type="text" required placeholder="Gartner, Forbes..." className={ic} />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-1">Year <span className="text-red-500">*</span></label>
                <input id="year" name="year" type="number" required defaultValue={currentYear} min={2000} max={currentYear + 1} className={ic} />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-slate-400 text-xs font-normal">(optional)</span></label>
              <textarea id="description" name="description" rows={2} placeholder="Short description of the recognition..." className={ic + ' resize-none'} />
            </div>
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Badge / Logo URL <span className="text-slate-400 text-xs font-normal">(optional)</span></label>
              <input id="logoUrl" name="logoUrl" type="text" placeholder="https://..." className={ic} />
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
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Create Award</button>
            <Link href="/admin/awards" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
