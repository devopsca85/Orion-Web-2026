import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { ApplicationStatus } from '@prisma/client'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const statusColors: Record<string, string> = {
  RECEIVED: 'bg-blue-100 text-blue-700',
  REVIEWING: 'bg-yellow-100 text-yellow-700',
  PHONE_SCREEN: 'bg-indigo-100 text-indigo-700',
  INTERVIEW: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
  HIRED: 'bg-emerald-100 text-emerald-700',
  WITHDRAWN: 'bg-slate-100 text-slate-600',
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function ApplicationsPage({ searchParams }: Props) {
  const session = await auth()
  const { status } = await searchParams
  const where = status && status !== 'all' ? { status: status as ApplicationStatus } : {}

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.jobApplication.count(),
  ])

  const allStatuses = ['all', 'RECEIVED', 'REVIEWING', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED', 'WITHDRAWN']

  return (
    <>
      <AdminTopBar title="Job Applications" user={session!.user} />
      <div className="p-6">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{total}</span> total application{total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {allStatuses.map((s) => (
            <Link
              key={s}
              href={`/admin/applications?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                (status ?? 'all') === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Role</th>
                  <th className="text-left px-5 py-3 font-medium">Department</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">No applications found.</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{app.name}</td>
                      <td className="px-5 py-3 text-slate-500">{app.email}</td>
                      <td className="px-5 py-3 text-slate-700">{app.role}</td>
                      <td className="px-5 py-3 text-slate-500">{app.department ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] ?? ''}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{app.createdAt.toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-xs"
                          >
                            <ExternalLink size={12} /> View
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
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
