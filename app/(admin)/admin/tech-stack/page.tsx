import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { prisma } from '@/lib/prisma'
import { deleteTechStack } from '@/lib/admin/tech-stack-actions'
import Link from 'next/link'
import { Plus, CheckCircle, Pencil } from 'lucide-react'

interface Props { searchParams: Promise<{ saved?: string }> }

export default async function TechStackPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  let items: { id: string; name: string; logoUrl: string; category: string; sortOrder: number; active: boolean }[] = []
  try {
    items = await prisma.techStack.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] })
  } catch { /* table not yet migrated */ }

  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <>
      <AdminTopBar title="Tech Stack" user={session!.user} />
      <div className="p-6 max-w-5xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" /> Tech entry saved successfully.
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{items.length} technolog{items.length !== 1 ? 'ies' : 'y'} across {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
          <Link href="/admin/tech-stack/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Add Technology
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Logo</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Order</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No technologies yet. <Link href="/admin/tech-stack/new" className="text-indigo-600 hover:underline">Add one</Link>.
                  </td>
                </tr>
              ) : items.map((item) => {
                const deleteAction = deleteTechStack.bind(null, item.id)
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="h-9 w-9 flex items-center justify-center bg-gray-50 rounded border border-slate-100 p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.logoUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {item.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/tech-stack/${item.id}`} className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors">
                          <Pencil size={13} /> Edit
                        </Link>
                        <DeleteForm action={deleteAction} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
