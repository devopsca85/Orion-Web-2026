import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import { saveHomeStats } from '@/lib/admin/settings-actions'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ saved?: string }>
}

const DEFAULTS = [
  { label: 'Years in Business',      value: '12+' },
  { label: 'Enterprise Clients',     value: '150+' },
  { label: 'Engineers & Consultants',value: '200+' },
  { label: 'Projects Delivered',     value: '500+' },
  { label: 'Countries Served',       value: '18' },
  { label: 'Client Satisfaction',    value: '98%' },
]

const inputClass = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function HomeStatsPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  let dbStats: { label: string; value: string }[] = []
  try {
    dbStats = await prisma.siteStat.findMany({ orderBy: { sortOrder: 'asc' } })
  } catch { /* ignore */ }

  const stats = Array.from({ length: 6 }, (_, i) => dbStats[i] ?? DEFAULTS[i] ?? { label: '', value: '' })

  return (
    <>
      <AdminTopBar title="Stats Section" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/home" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ChevronLeft size={16} /> Back to Home Settings
        </Link>

        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" /> Stats saved.
          </div>
        )}

        <form action={saveHomeStats} className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3">
              Stats Bar — up to 6 items
            </h2>
            {stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Value {i + 1}</label>
                  <input name={`stat.${i + 1}.value`} type="text" defaultValue={stat.value} placeholder="e.g. 150+" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Label {i + 1}</label>
                  <input name={`stat.${i + 1}.label`} type="text" defaultValue={stat.label} placeholder="e.g. Enterprise Clients" className={inputClass} />
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            Save Stats
          </button>
        </form>
      </div>
    </>
  )
}
