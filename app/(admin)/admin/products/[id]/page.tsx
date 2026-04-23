import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateProduct } from '@/lib/admin/product-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

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
      <div className="p-6 max-w-4xl">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Products
        </Link>

        <form action={updateWithSlug} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Product Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input id="title" name="title" type="text" required defaultValue={product.title} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug <span className="text-slate-400 text-xs font-normal ml-1">— changes the URL</span></label>
                <input name="slug" type="text" defaultValue={product.slug} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono" />
              </div>
            </div>

            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-slate-700 mb-1">
                Tagline <span className="text-slate-400 text-xs font-normal">(shown in nav menu card)</span>
              </label>
              <input id="tagline" name="tagline" type="text" maxLength={300} defaultValue={product.tagline} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
              <input id="logoUrl" name="logoUrl" type="text" defaultValue={product.logoUrl ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
              <textarea id="description" name="description" rows={6} defaultValue={product.description} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-slate-700 mb-1">
                Features <span className="text-slate-400 text-xs font-normal">(one per line or JSON array)</span>
              </label>
              <textarea
                id="features" name="features" rows={4}
                defaultValue={Array.isArray(product.features) ? (product.features as string[]).join('\n') : JSON.stringify(product.features, null, 2)}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">SEO & Settings</h2>

            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
              <input id="metaTitle" name="metaTitle" type="text" maxLength={70} defaultValue={product.metaTitle ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="metaDesc" className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
              <textarea id="metaDesc" name="metaDesc" rows={2} maxLength={160} defaultValue={product.metaDesc ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={product.sortOrder} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input id="published" name="published" type="checkbox" defaultChecked={product.published} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            <Link href="/admin/products" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
