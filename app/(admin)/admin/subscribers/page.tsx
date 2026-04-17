import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteSubscriber } from '@/lib/admin/actions'

export default async function SubscribersPage() {
  const session = await auth()
  const [subscribers, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
  ])

  return (
    <>
      <AdminTopBar title="Newsletter Subscribers" user={session!.user} />
      <div className="p-6">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{total}</span> active subscriber{total !== 1 ? 's' : ''} &mdash; {subscribers.length} total
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Source</th>
                  <th className="text-left px-5 py-3 font-medium">Confirmed</th>
                  <th className="text-left px-5 py-3 font-medium">Unsubscribed</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">No subscribers yet.</td>
                  </tr>
                ) : (
                  subscribers.map((sub) => {
                    const deleteAction = deleteSubscriber.bind(null, sub.id)
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{sub.email}</td>
                        <td className="px-5 py-3 text-slate-500">{sub.name ?? '—'}</td>
                        <td className="px-5 py-3 text-slate-500">{sub.source ?? '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sub.confirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {sub.confirmed ? 'Confirmed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {sub.unsubscribed ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Unsubscribed</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{sub.createdAt.toLocaleDateString()}</td>
                        <td className="px-5 py-3">
                          <DeleteForm action={deleteAction} label="Remove" />
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
