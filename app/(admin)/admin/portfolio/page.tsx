import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deletePortfolioItem } from '@/lib/admin/actions'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export default async function PortfolioPage() {
  const session = await auth()
  const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <>
      <AdminTopBar title="Portfolio" user={session!.user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/portfolio/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Item
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-5 py-3 font-medium">Industry</th>
                  <th className="text-left px-5 py-3 font-medium">Featured</th>
                  <th className="text-left px-5 py-3 font-medium">Published</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No portfolio items yet. <Link href="/admin/portfolio/new" className="text-indigo-600 hover:underline">Add one</Link>.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const deleteAction = deletePortfolioItem.bind(null, item.slug)
                    return (
                      <tr key={item.slug} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800 max-w-xs">
                          <span className="truncate block">{item.title}</span>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{item.client}</td>
                        <td className="px-5 py-3 text-slate-500">{item.industry}</td>
                        <td className="px-5 py-3">
                          {item.featured ? (
                            <span className="text-yellow-500 font-bold">★</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {item.published ? 'Published' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/portfolio/${item.slug}`}
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
