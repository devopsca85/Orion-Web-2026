import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteUser } from '@/lib/admin/actions'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  EDITOR: 'bg-blue-100 text-blue-700',
  AUTHOR: 'bg-green-100 text-green-700',
}

export default async function UsersPage() {
  const session = await auth()
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <>
      <AdminTopBar title="Users" user={session!.user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{users.length} user{users.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/users/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New User
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Role</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Last Login</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const deleteAction = deleteUser.bind(null, user.id)
                    return (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{user.email}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] ?? ''}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400">
                          {user.lastLoginAt ? user.lastLoginAt.toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors"
                            >
                              <Pencil size={13} /> Edit
                            </Link>
                            {session?.user.id !== user.id && (
                              <DeleteForm action={deleteAction} />
                            )}
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
