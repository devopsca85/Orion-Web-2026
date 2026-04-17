import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createClientLogo } from '@/lib/admin/client-logo-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function NewClientLogoPage() {
  const session = await auth()
  return (
    <>
      <AdminTopBar title="New Client Logo" user={session!.user} />
      <div className="p-6 max-w-xl">
        <Link href="/admin/client-logos" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5"><ChevronLeft size={16} /> Back</Link>
        <form action={createClientLogo} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Logo Details</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Company Name <span className="text-red-500">*</span></label>
              <input id="name" name="name" type="text" required placeholder="Acme Corporation" className={ic} />
            </div>
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Logo URL <span className="text-red-500">*</span></label>
              <input id="logoUrl" name="logoUrl" type="text" required placeholder="https://... or /assets/logos/acme.svg" className={ic} />
              <p className="text-xs text-slate-400 mt-1">SVG or PNG preferred. Will be displayed at ~120px wide.</p>
            </div>
            <div>
              <label htmlFor="href" className="block text-sm font-medium text-slate-700 mb-1">Link URL <span className="text-slate-400 text-xs font-normal">(optional)</span></label>
              <input id="href" name="href" type="text" placeholder="https://acme.com" className={ic} />
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
            <Link href="/admin/client-logos" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
