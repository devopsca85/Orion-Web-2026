import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createProduct } from '@/lib/admin/product-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewProductPage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Product" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Products
        </Link>

        <form action={createProduct} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Product Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input id="title" name="title" type="text" required className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
                  Slug <span className="text-slate-400 text-xs font-normal">(auto from title)</span>
                </label>
                <input id="slug" name="slug" type="text" placeholder="orion-erp" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>

            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-slate-700 mb-1">
                Tagline <span className="text-slate-400 text-xs font-normal">(short description for menu cards)</span>
              </label>
              <input id="tagline" name="tagline" type="text" maxLength={300} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Logo URL <span className="text-slate-400 text-xs font-normal">(from /admin/media)</span>
              </label>
              <input id="logoUrl" name="logoUrl" type="text" placeholder="/assets/images/products/orion-erp.png" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
              <textarea id="description" name="description" rows={6} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-slate-700 mb-1">
                Features <span className="text-slate-400 text-xs font-normal">(one per line or JSON array)</span>
              </label>
              <textarea id="features" name="features" rows={4} placeholder="Finance & Accounting&#10;Inventory Management&#10;HR & Payroll" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">SEO & Settings</h2>

            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
              <input id="metaTitle" name="metaTitle" type="text" maxLength={70} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="metaDesc" className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
              <textarea id="metaDesc" name="metaDesc" rows={2} maxLength={160} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input id="published" name="published" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Create Product</button>
            <Link href="/admin/products" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
