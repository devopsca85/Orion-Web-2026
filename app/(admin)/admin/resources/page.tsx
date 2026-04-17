import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteResource } from '@/lib/admin/actions'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export default async function ResourcesPage() {
  const session = await auth()
  const resources = await prisma.resource.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <>
      <AdminTopBar title="Resources" user={session!.user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{resources.length} resource{resources.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/resources/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Resource
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Topic</th>
                  <th className="text-left px-5 py-3 font-medium">Gated</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      No resources yet. <Link href="/admin/resources/new" className="text-indigo-600 hover:underline">Add one</Link>.
                    </td>
                  </tr>
                ) : (
                  resources.map((resource) => {
                    const deleteAction = deleteResource.bind(null, resource.id)
                    return (
                      <tr key={resource.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800 max-w-xs truncate">{resource.title}</td>
                        <td className="px-5 py-3 text-slate-500">{resource.type}</td>
                        <td className="px-5 py-3 text-slate-500">{resource.topic}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${resource.gated ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                            {resource.gated ? 'Gated' : 'Free'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${resource.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {resource.published ? 'Published' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400">{resource.createdAt.toLocaleDateString()}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/resources/${resource.id}`}
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
