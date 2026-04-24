import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { updateJobOpening } from '@/lib/admin/job-opening-actions'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props { params: Promise<{ id: string }> }

export default async function EditJobOpeningPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  const opening = await prisma.jobOpening.findUnique({ where: { id } })
  if (!opening) notFound()

  const action = updateJobOpening.bind(null, id)
  const requirements = Array.isArray(opening.requirements) ? (opening.requirements as string[]).join('\n') : ''

  return (
    <>
      <AdminTopBar title="Edit Job Opening" user={session!.user} />
      <div className="p-6 max-w-3xl">
        <Link href="/admin/job-openings" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ChevronLeft size={15} /> Back to Job Openings
        </Link>

        <form action={action} className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title <span className="text-red-500">*</span></label>
              <input name="title" required defaultValue={opening.title} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department <span className="text-red-500">*</span></label>
              <input name="department" required defaultValue={opening.department} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location <span className="text-red-500">*</span></label>
              <input name="location" required defaultValue={opening.location} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <select name="type" defaultValue={opening.type} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
              <input name="level" defaultValue={opening.level} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary / Range</label>
              <input name="salary" defaultValue={opening.salary ?? ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
              <input name="sortOrder" type="number" defaultValue={opening.sortOrder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <RichTextEditor name="description" content={opening.description ?? ''} minHeight="250px" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Requirements <span className="text-xs text-slate-400">(one per line)</span></label>
              <textarea name="requirements" rows={5} defaultValue={requirements} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y font-mono" />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input type="checkbox" name="active" id="active" defaultChecked={opening.active} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="active" className="text-sm text-slate-700">Active (visible on /careers)</label>
            </div>
          </div>

          <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
            <Link href="/admin/job-openings" className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">Cancel</Link>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </>
  )
}
