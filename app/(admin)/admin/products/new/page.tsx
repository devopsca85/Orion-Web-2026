import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createProduct } from '@/lib/admin/product-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function NewProductPage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Product" user={session!.user} />
      <div className="p-6 max-w-xl">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Products
        </Link>

        <form action={createProduct} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Product Details</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input id="title" name="title" type="text" required className={ic} placeholder="e.g. VoAgents AI" />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
              <input id="logoUrl" name="logoUrl" type="text" className={ic} placeholder="https://example.com/logo.png" />
            </div>

            <div>
              <label htmlFor="redirectUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Redirect URL <span className="text-slate-400 text-xs font-normal">(where &quot;Learn more&quot; links)</span>
              </label>
              <input id="redirectUrl" name="redirectUrl" type="text" className={ic} placeholder="https://voagents.ai" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} className={ic} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="published" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Published</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Product
            </button>
            <Link href="/admin/products" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
