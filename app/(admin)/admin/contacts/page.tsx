import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import Link from 'next/link'
import { Eye } from 'lucide-react'

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  REVIEWED: 'bg-yellow-100 text-yellow-700',
  RESPONDED: 'bg-purple-100 text-purple-700',
  CLOSED: 'bg-slate-100 text-slate-600',
  SPAM: 'bg-red-100 text-red-600',
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function ContactsPage({ searchParams }: Props) {
  const session = await auth()
  const { status } = await searchParams
  const where = status && status !== 'all' ? { status: status as import('@prisma/client').SubmissionStatus } : {}

  const [contacts, newCount, reviewedCount, respondedCount, closedCount] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.contactSubmission.count({ where: { status: 'NEW' } }),
    prisma.contactSubmission.count({ where: { status: 'REVIEWED' } }),
    prisma.contactSubmission.count({ where: { status: 'RESPONDED' } }),
    prisma.contactSubmission.count({ where: { status: 'CLOSED' } }),
  ])

  const statuses = ['all', 'NEW', 'REVIEWED', 'RESPONDED', 'CLOSED', 'SPAM']

  return (
    <>
      <AdminTopBar title="Contact Submissions" user={session!.user} />
      <div className="p-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'New', count: newCount, color: 'bg-blue-100 text-blue-700' },
            { label: 'Reviewed', count: reviewedCount, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Responded', count: respondedCount, color: 'bg-purple-100 text-purple-700' },
            { label: 'Closed', count: closedCount, color: 'bg-slate-100 text-slate-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">{stat.label}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-sm font-semibold ${stat.color}`}>{stat.count}</span>
            </div>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/admin/contacts?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                (status ?? 'all') === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Company</th>
                  <th className="text-left px-5 py-3 font-medium">Service</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">No submissions found.</td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                      <td className="px-5 py-3 text-slate-500">{c.email}</td>
                      <td className="px-5 py-3 text-slate-500">{c.company ?? '—'}</td>
                      <td className="px-5 py-3 text-slate-500">{c.service ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] ?? ''}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{c.createdAt.toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/contacts/${c.id}`}
                          className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors w-fit"
                        >
                          <Eye size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
