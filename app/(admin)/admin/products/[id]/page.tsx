import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateProduct } from '@/lib/admin/product-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const session = await auth()
  const { id }  = await params

  const product = await prisma.product.findUnique({ where: { slug: id } })
  if (!product) notFound()

  const updateWithSlug = updateProduct.bind(null, product.slug)

  return (
    <>
      <AdminTopBar title="Edit Product" user={session!.user} />
      <div className="p-6 max-w-xl">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Products
        </Link>

        <form action={updateWithSlug} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">Product Details</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input id="title" name="title" type="text" required defaultValue={product.title} className={ic} />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
              <input id="logoUrl" name="logoUrl" type="text" defaultValue={product.logoUrl ?? ''} className={ic} placeholder="https://example.com/logo.png" />
            </div>

            <div>
              <label htmlFor="redirectUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Redirect URL <span className="text-slate-400 text-xs font-normal">(where &quot;Learn more&quot; links)</span>
              </label>
              <input id="redirectUrl" name="redirectUrl" type="text" defaultValue={product.redirectUrl ?? ''} className={ic} placeholder="https://voagents.ai" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={product.sortOrder} min={0} className={ic} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="published" type="checkbox" defaultChecked={product.published} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Published</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Save Changes
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
