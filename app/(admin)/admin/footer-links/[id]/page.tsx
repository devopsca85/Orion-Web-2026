import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateFooterLink } from '@/lib/admin/footer-link-actions'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

const inputClass =
  'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function EditFooterLinkPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  const link = await prisma.footerLink.findUnique({ where: { id } })
  if (!link) notFound()

  const update = updateFooterLink.bind(null, id)

  return (
    <>
      <AdminTopBar title="Edit Footer Link" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/footer-links" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ChevronLeft size={16} />
          Back to Footer Links
        </Link>

        <form action={update} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Link Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-slate-700 mb-1">
                  Label <span className="text-red-500">*</span>
                </label>
                <input id="label" name="label" type="text" required defaultValue={link.label} className={inputClass} />
              </div>
              <div>
                <label htmlFor="group" className="block text-sm font-medium text-slate-700 mb-1">
                  Group <span className="text-red-500">*</span>
                </label>
                <input id="group" name="group" type="text" required defaultValue={link.group} className={inputClass} />
                <p className="text-xs text-slate-400 mt-1">e.g. Services, Company, Legal</p>
              </div>
            </div>

            <div>
              <label htmlFor="href" className="block text-sm font-medium text-slate-700 mb-1">
                URL <span className="text-red-500">*</span>
              </label>
              <input id="href" name="href" type="text" required defaultValue={link.href} className={inputClass} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">
                  Sort Order
                </label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={link.sortOrder} className={inputClass} />
              </div>
              <div>
                <label htmlFor="active" className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select id="active" name="active" defaultValue={link.active ? 'true' : 'false'} className={inputClass}>
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
              <div>
                <label htmlFor="openInNew" className="block text-sm font-medium text-slate-700 mb-1">
                  Open In
                </label>
                <select id="openInNew" name="openInNew" defaultValue={link.openInNew ? 'true' : 'false'} className={inputClass}>
                  <option value="false">Same Tab</option>
                  <option value="true">New Tab</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
            <Link href="/admin/footer-links" className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
