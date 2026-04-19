import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import { deleteCountryOffice } from '@/lib/admin/country-office-actions'
import { CheckCircle, Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ saved?: string }>
}

export default async function CountryOfficesPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams
  let offices: Awaited<ReturnType<typeof prisma.countryOffice.findMany>> = []
  try {
    offices = await prisma.countryOffice.findMany({ orderBy: [{ sortOrder: 'asc' }, { country: 'asc' }] })
  } catch {
    // table may not exist yet — run prisma db push on the server
  }

  return (
    <>
      <AdminTopBar title="Country Offices" user={session!.user} />
      <div className="p-6 max-w-4xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Office saved successfully.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{offices.length} office{offices.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/country-offices/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Office
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {offices.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              No offices yet. Click &ldquo;Add Office&rdquo; to create one.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Country</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Address</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offices.map((office) => (
                  <tr key={office.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <span className="mr-2">{office.flag}</span>
                      {office.country}
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-xs truncate">
                      {office.address || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">
                      <div>{office.phone || '—'}</div>
                      <div className="text-xs text-slate-400">{office.email || ''}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${office.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {office.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/country-offices/${office.id}`}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <form action={deleteCountryOffice.bind(null, office.id)}>
                          <button
                            type="submit"
                            className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                            onClick={(e) => { if (!confirm('Delete this office?')) e.preventDefault() }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
