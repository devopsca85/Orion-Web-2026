import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createNavItem } from '@/lib/admin/nav-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewNavItemPage() {
  const session = await auth()
  const allItems = await prisma.navItem.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, label: true, type: true, parentId: true },
  })

  return (
    <>
      <AdminTopBar title="New Nav Item" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/navigation" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Navigation
        </Link>

        <form action={createNavItem} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Nav Item Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-slate-700 mb-1">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  id="label"
                  name="label"
                  type="text"
                  required
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="href" className="block text-sm font-medium text-slate-700 mb-1">Href</label>
                <input
                  id="href"
                  name="href"
                  type="text"
                  placeholder="/services"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  id="type"
                  name="type"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="link">link</option>
                  <option value="dropdown">dropdown</option>
                  <option value="mega">mega</option>
                  <option value="megaGroup">megaGroup</option>
                  <option value="productMega">productMega</option>
                  <option value="productCard">productCard</option>
                </select>
              </div>
              <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-slate-700 mb-1">
                  Parent <span className="text-slate-400 text-xs font-normal">(blank = top level)</span>
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">— Top Level —</option>
                  {allItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} ({item.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="cardDesc" className="block text-sm font-medium text-slate-700 mb-1">
                Card Description <span className="text-slate-400 text-xs font-normal">(productCard type)</span>
              </label>
              <textarea
                id="cardDesc"
                name="cardDesc"
                rows={3}
                maxLength={300}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Logo URL <span className="text-slate-400 text-xs font-normal">(productCard type)</span>
              </label>
              <input
                id="logoUrl"
                name="logoUrl"
                type="text"
                placeholder="/assets/images/logo.png"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="openInNew"
                  name="openInNew"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="openInNew" className="text-sm font-medium text-slate-700">Open in New Tab</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Item
            </button>
            <Link href="/admin/navigation" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
