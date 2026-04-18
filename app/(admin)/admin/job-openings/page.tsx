import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { prisma } from '@/lib/prisma'
import { deleteJobOpening } from '@/lib/admin/job-opening-actions'
import Link from 'next/link'
import { Plus, CheckCircle, Pencil, Briefcase } from 'lucide-react'

interface Props { searchParams: Promise<{ saved?: string }> }

export default async function JobOpeningsPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  let openings: { id: string; title: string; department: string; location: string; type: string; level: string; active: boolean; sortOrder: number }[] = []
  try {
    openings = await prisma.jobOpening.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, title: true, department: true, location: true, type: true, level: true, active: true, sortOrder: true },
    })
  } catch { /* table not yet migrated */ }

  return (
    <>
      <AdminTopBar title="Job Openings" user={session!.user} />
      <div className="p-6 max-w-6xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" /> Job opening saved successfully.
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{openings.length} position{openings.length !== 1 ? 's' : ''}</p>
          <Link href="/admin/job-openings/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Add Opening
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Department</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Location</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Level</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {openings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No openings yet. <Link href="/admin/job-openings/new" className="text-indigo-600 hover:underline">Add one</Link>.
                  </td>
                </tr>
              ) : openings.map((opening) => {
                const deleteAction = deleteJobOpening.bind(null, opening.id)
                return (
                  <tr key={opening.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Briefcase size={15} className="text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{opening.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{opening.department}</td>
                    <td className="px-4 py-3 text-slate-500">{opening.location}</td>
                    <td className="px-4 py-3 text-slate-500">{opening.type}</td>
                    <td className="px-4 py-3 text-slate-500">{opening.level}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${opening.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {opening.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/job-openings/${opening.id}`} className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors">
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
