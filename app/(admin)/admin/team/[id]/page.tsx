import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateTeamMember } from '@/lib/admin/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTeamMemberPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) notFound()

  const updateWithId = updateTeamMember.bind(null, member.id)

  return (
    <>
      <AdminTopBar title="Edit Team Member" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/team"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Team
        </Link>

        <form action={updateWithId} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Member Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={member.name}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                  Role/Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  required
                  defaultValue={member.role}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={member.bio}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                defaultValue={member.avatarUrl ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                defaultValue={member.linkedin ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={member.sortOrder}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  defaultChecked={member.active}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">Active</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
            <Link
              href="/admin/team"
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
