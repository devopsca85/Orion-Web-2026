import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateTechStack } from '@/lib/admin/tech-stack-actions'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const categories = ['Frontend', 'Backend', 'Cloud', 'Database', 'DevOps', 'Mobile', 'AI & ML', 'Security', 'Other']

interface Props { params: Promise<{ id: string }> }

export default async function EditTechStackPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  let item
  try { item = await prisma.techStack.findUnique({ where: { id } }) } catch { item = null }
  if (!item) notFound()
  const action = updateTechStack.bind(null, id)

  return (
    <>
      <AdminTopBar title="Edit Technology" user={session!.user} />
      <div className="p-6 max-w-xl">
        <Link href="/admin/tech-stack" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5"><ChevronLeft size={16} /> Back</Link>
        <form action={action} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Technology Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input id="name" name="name" type="text" required defaultValue={item.name} className={ic} />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select id="category" name="category" defaultValue={item.category} className={ic}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Logo URL <span className="text-red-500">*</span></label>
              <input id="logoUrl" name="logoUrl" type="text" required defaultValue={item.logoUrl} className={ic} />
              {item.logoUrl && (
                <div className="mt-2 h-10 w-10 flex items-center justify-center bg-gray-50 rounded border border-slate-100 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.logoUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={item.sortOrder} min={0} className={ic} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="active" type="checkbox" defaultChecked={item.active} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            <Link href="/admin/tech-stack" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
