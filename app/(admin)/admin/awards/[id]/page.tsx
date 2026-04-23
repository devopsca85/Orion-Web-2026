import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateAward } from '@/lib/admin/award-actions'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

interface Props { params: Promise<{ id: string }> }

export default async function EditAwardPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  let award
  try { award = await prisma.award.findUnique({ where: { id } }) } catch { award = null }
  if (!award) notFound()
  const action = updateAward.bind(null, id)
  const currentYear = new Date().getFullYear()

  return (
    <>
      <AdminTopBar title="Edit Award" user={session!.user} />
      <div className="p-6 max-w-xl">
        <Link href="/admin/awards" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5"><ChevronLeft size={16} /> Back</Link>
        <form action={action} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Award Details</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Award Title <span className="text-red-500">*</span></label>
              <input id="title" name="title" type="text" required defaultValue={award.title} className={ic} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="issuer" className="block text-sm font-medium text-slate-700 mb-1">Issuer</label>
                <input id="issuer" name="issuer" type="text" defaultValue={award.issuer} className={ic} />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                <input id="year" name="year" type="number" defaultValue={award.year ?? undefined} min={2000} max={currentYear + 1} className={ic} />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea id="description" name="description" rows={2} defaultValue={award.description ?? ''} className={ic + ' resize-none'} />
            </div>
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Badge / Logo URL</label>
              <input id="logoUrl" name="logoUrl" type="text" defaultValue={award.logoUrl ?? ''} className={ic} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={award.sortOrder} min={0} className={ic} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="active" type="checkbox" defaultChecked={award.active} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            <Link href="/admin/awards" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
