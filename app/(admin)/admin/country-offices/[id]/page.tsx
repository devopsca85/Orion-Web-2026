import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateCountryOffice } from '@/lib/admin/country-office-actions'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CheckCircle } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}

const inputClass =
  'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function EditCountryOfficePage({ params, searchParams }: Props) {
  const session = await auth()
  const { id } = await params
  const { saved } = await searchParams
  let office: Awaited<ReturnType<typeof prisma.countryOffice.findUnique>> = null
  try {
    office = await prisma.countryOffice.findUnique({ where: { id } })
  } catch {
    notFound()
  }
  if (!office) notFound()

  const update = updateCountryOffice.bind(null, id)

  return (
    <>
      <AdminTopBar title="Edit Country Office" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/country-offices" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ChevronLeft size={16} />
          Back to Country Offices
        </Link>

        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Country office saved successfully.
          </div>
        )}

        <form action={update} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Office Details
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input id="country" name="country" type="text" required defaultValue={office.country} className={inputClass} />
              </div>
              <div>
                <label htmlFor="flag" className="block text-sm font-medium text-slate-700 mb-1">
                  Flag Logo URL
                </label>
                <input id="flag" name="flag" type="url" defaultValue={office.flag ?? ''} placeholder="https://cdn.example.com/flags/in.png" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <textarea id="address" name="address" rows={3} defaultValue={office.address ?? ''} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input id="phone" name="phone" type="tel" defaultValue={office.phone ?? ''} className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input id="email" name="email" type="email" defaultValue={office.email ?? ''} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">
                  Sort Order
                </label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={office.sortOrder} className={inputClass} />
              </div>
              <div>
                <label htmlFor="active" className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select id="active" name="active" defaultValue={office.active ? 'true' : 'false'} className={inputClass}>
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
            <Link href="/admin/country-offices" className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
