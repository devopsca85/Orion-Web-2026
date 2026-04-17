import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteTeamMember } from '@/lib/admin/actions'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export default async function TeamPage() {
  const session = await auth()
  const members = await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <>
      <AdminTopBar title="Team Members" user={session!.user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/team/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Member
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Role</th>
                  <th className="text-left px-5 py-3 font-medium">Sort Order</th>
                  <th className="text-left px-5 py-3 font-medium">Active</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      No team members yet. <Link href="/admin/team/new" className="text-indigo-600 hover:underline">Add one</Link>.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const deleteAction = deleteTeamMember.bind(null, member.id)
                    return (
                      <tr key={member.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-slate-800">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{member.role}</td>
                        <td className="px-5 py-3 text-slate-500">{member.sortOrder}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {member.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/team/${member.id}`}
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
