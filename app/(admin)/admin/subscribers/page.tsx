import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteSubscriber } from '@/lib/admin/actions'
import Link from 'next/link'
import { Download, Send } from 'lucide-react'

export default async function SubscribersPage() {
  const session = await auth()
  const [subscribers, total, confirmed] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
    prisma.newsletterSubscriber.count({ where: { confirmed: true, unsubscribed: false } }),
  ])

  return (
    <>
      <AdminTopBar title="Newsletter Subscribers" user={session!.user} />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{confirmed}</span> confirmed &nbsp;·&nbsp;{' '}
              <span className="font-semibold text-slate-800">{total}</span> active &nbsp;·&nbsp;{' '}
              {subscribers.length} total
            </p>
          </div>
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API endpoint download, not a page navigation */}
            <a
              href="/api/admin/newsletter/export"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download size={15} />
              Export CSV
            </a>
            <Link
              href="/admin/newsletter"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Send size={15} />
              Send Newsletter
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Source</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">No subscribers yet.</td>
                  </tr>
                ) : (
                  subscribers.map((sub) => {
                    const deleteAction = deleteSubscriber.bind(null, sub.id)
                    const statusLabel = sub.unsubscribed
                      ? { text: 'Unsubscribed', cls: 'bg-red-100 text-red-600' }
                      : sub.confirmed
                        ? { text: 'Confirmed', cls: 'bg-green-100 text-green-700' }
                        : { text: 'Pending', cls: 'bg-yellow-100 text-yellow-700' }
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{sub.email}</td>
                        <td className="px-5 py-3 text-slate-500">{sub.name ?? '—'}</td>
                        <td className="px-5 py-3 text-slate-500">
                          {sub.source ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono">{sub.source}</span>
                          ) : '—'}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusLabel.cls}`}>
                            {statusLabel.text}
                          </span>
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
