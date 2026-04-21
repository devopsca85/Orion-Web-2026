import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CheckCircle, Download, Eye, Linkedin, Globe } from 'lucide-react'
import { updateApplication } from '@/lib/admin/application-actions'
import { ApplicationStatus } from '@prisma/client'
import { DeleteApplicationButton } from '@/components/admin/DeleteApplicationButton'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}

const statusColors: Record<string, string> = {
  RECEIVED:     'bg-blue-100 text-blue-700',
  REVIEWING:    'bg-yellow-100 text-yellow-700',
  PHONE_SCREEN: 'bg-indigo-100 text-indigo-700',
  INTERVIEW:    'bg-purple-100 text-purple-700',
  OFFER:        'bg-green-100 text-green-700',
  REJECTED:     'bg-red-100 text-red-600',
  HIRED:        'bg-emerald-100 text-emerald-700',
  WITHDRAWN:    'bg-slate-100 text-slate-600',
}

const allStatuses: ApplicationStatus[] = [
  'RECEIVED', 'REVIEWING', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED', 'WITHDRAWN',
]

const inputClass = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function ApplicationDetailPage({ params, searchParams }: Props) {
  const session   = await auth()
  const { id }    = await params
  const { saved } = await searchParams

  const app = await prisma.jobApplication.findUnique({ where: { id } })
  if (!app) notFound()

  const update = updateApplication.bind(null, id)

  return (
    <>
      <AdminTopBar title="Application Detail" user={session!.user} />
      <div className="p-6 max-w-3xl">
        <Link href="/admin/applications" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ChevronLeft size={16} /> Back to Applications
        </Link>

        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Application updated successfully.
          </div>
        )}

        {/* Applicant Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{app.name}</h2>
              <p className="text-sm text-slate-500">{app.role}{app.department ? ` · ${app.department}` : ''}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] ?? ''}`}>
              {app.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Email</p>
              <a href={`mailto:${app.email}`} className="text-indigo-600 hover:underline">{app.email}</a>
            </div>
            {app.phone && (
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                <a href={`tel:${app.phone}`} className="text-slate-700 hover:underline">{app.phone}</a>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Applied</p>
              <p className="text-slate-700">{app.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            {app.reviewedBy && (
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Reviewed by</p>
                <p className="text-slate-700">{app.reviewedBy}</p>
              </div>
            )}
          </div>

          {(app.linkedinUrl || app.portfolioUrl) && (
            <div className="flex gap-3">
              {app.linkedinUrl && (
                <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50">
                  <Linkedin size={13} /> LinkedIn
                </a>
              )}
              {app.portfolioUrl && (
                <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50">
                  <Globe size={13} /> Portfolio
                </a>
              )}
            </div>
          )}
        </div>

        {/* CV Section */}
        {app.resumeUrl && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Resume / CV</h3>
            <div className="flex gap-3">
              <a
                href={`/api/admin/cv-download?path=${encodeURIComponent(app.resumeUrl)}&mode=download`}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Download size={15} /> Download CV
              </a>
              <a
                href={`/api/admin/cv-download?path=${encodeURIComponent(app.resumeUrl)}&mode=view`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Eye size={15} /> View in Browser
              </a>
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {app.coverLetter && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Cover Letter</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{app.coverLetter}</p>
          </div>
        )}

        {/* Edit Form */}
        <form action={update} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3">
            Update Application
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select id="status" name="status" defaultValue={app.status} className={inputClass}>
                {allStatuses.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="reviewedBy" className="block text-xs font-medium text-slate-600 mb-1">Reviewed by</label>
              <input id="reviewedBy" name="reviewedBy" type="text" defaultValue={app.reviewedBy ?? ''} placeholder="Your name" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-medium text-slate-600 mb-1">Internal Notes</label>
            <textarea id="notes" name="notes" rows={4} defaultValue={app.notes ?? ''} placeholder="Add notes about this applicant…" className={inputClass} />
          </div>

          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            Save Changes
          </button>
        </form>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <h3 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h3>
          <p className="text-xs text-slate-500 mb-4">Permanently delete this application. This cannot be undone.</p>
          <DeleteApplicationButton id={id} />
        </div>
      </div>
    </>
  )
}
