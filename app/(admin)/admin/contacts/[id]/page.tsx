import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateContactStatus, addContactNote } from '@/lib/admin/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Mail } from 'lucide-react'

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  REVIEWED: 'bg-yellow-100 text-yellow-700',
  RESPONDED: 'bg-purple-100 text-purple-700',
  CLOSED: 'bg-slate-100 text-slate-600',
  SPAM: 'bg-red-100 text-red-600',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContactDetailPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const contact = await prisma.contactSubmission.findUnique({ where: { id } })
  if (!contact) notFound()

  const updateStatus = updateContactStatus.bind(null, contact.id)
  const addNote = addContactNote.bind(null, contact.id)

  return (
    <>
      <AdminTopBar title="Contact Detail" user={session!.user} />
      <div className="p-6 max-w-3xl">
        <Link href="/admin/contacts" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Contacts
        </Link>

        <div className="space-y-5">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">{contact.name}</h2>
                <p className="text-slate-500 text-sm mt-0.5">{contact.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[contact.status] ?? ''}`}>
                {contact.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Company</p>
                <p className="text-slate-700">{contact.company ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-slate-700">{contact.phone ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Service Interest</p>
                <p className="text-slate-700">{contact.service ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Submitted</p>
                <p className="text-slate-700">{contact.createdAt.toLocaleString()}</p>
              </div>
              {contact.respondedAt && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Responded At</p>
                  <p className="text-slate-700">{contact.respondedAt.toLocaleString()}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Message</p>
              <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm whitespace-pre-wrap">{contact.message}</div>
            </div>

            <div className="mt-4">
              <a
                href={`mailto:${contact.email}?subject=Re: Your inquiry to Orion Solutions`}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Mail size={15} /> Reply by Email
              </a>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Update Status</h3>
            <form action={updateStatus} className="flex items-center gap-3">
              <select
                name="status"
                defaultValue={contact.status}
                className="block rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="NEW">NEW</option>
                <option value="REVIEWED">REVIEWED</option>
                <option value="RESPONDED">RESPONDED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="SPAM">SPAM</option>
              </select>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save Status
              </button>
            </form>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Internal Notes</h3>
            <form action={addNote} className="space-y-3">
              <textarea
                name="notes"
                rows={4}
                defaultValue={contact.notes ?? ''}
                placeholder="Add internal notes here..."
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save Notes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
