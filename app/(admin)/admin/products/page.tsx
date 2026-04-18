import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteProduct } from '@/lib/admin/product-actions'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export default async function ProductsAdminPage() {
  const session  = await auth()
  const products = await prisma.product.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <>
      <AdminTopBar title="Products" user={session!.user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Product
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Slug</th>
                  <th className="text-left px-5 py-3 font-medium">Sort</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      No products yet.{' '}
                      <Link href="/admin/products/new" className="text-indigo-600 hover:underline">Add one</Link>.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const deleteAction = deleteProduct.bind(null, product.slug)
                    return (
                      <tr key={product.slug} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{product.title}</td>
                        <td className="px-5 py-3 text-slate-500 font-mono text-xs">{product.slug}</td>
                        <td className="px-5 py-3 text-slate-500">{product.sortOrder}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {product.published ? 'Published' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/products/${product.slug}`}
                              className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors"
                            >
                              <Pencil size={13} /> Edit
                            </Link>
                            <DeleteForm action={deleteAction} />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
