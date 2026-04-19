import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import Link from 'next/link'
import { Users, Eye, Globe, TrendingUp } from 'lucide-react'

const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })

function countryFlag(code: string): string {
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E0 + c.charCodeAt(0) - 65)).join('')
}

function countryName(code: string | null): string {
  if (!code) return 'Unknown'
  try { return displayNames.of(code) ?? code } catch { return code }
}

function sinceDate(period: string): Date {
  const now = new Date()
  if (period === 'today') { const d = new Date(now); d.setHours(0, 0, 0, 0); return d }
  if (period === '30d') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const session = await auth()
  const { period = '7d' } = await searchParams
  const since = sinceDate(period)

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    totalViews,
    todayViews,
    uniqueIpRows,
    topPages,
    topCountries,
    recentVisitors,
  ] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: since }, bot: false } }),
    prisma.pageView.count({ where: { createdAt: { gte: todayStart }, bot: false } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since }, bot: false },
      select: { ip: true },
      distinct: ['ip'],
    }),
    prisma.pageView.groupBy({
      by: ['path'],
      where: { createdAt: { gte: since }, bot: false },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ['country'],
      where: { createdAt: { gte: since }, bot: false, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    }),
    prisma.pageView.findMany({
      where: { bot: false },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { id: true, ip: true, country: true, city: true, path: true, referrer: true, ua: true, createdAt: true },
    }),
  ])

  const uniqueVisitors = uniqueIpRows.length
  const maxPageViews   = topPages[0]?._count.path ?? 1
  const maxCountryViews = topCountries[0]?._count.country ?? 1

  const periods = [
    { key: 'today', label: 'Today' },
    { key: '7d',   label: 'Last 7 days' },
    { key: '30d',  label: 'Last 30 days' },
  ]

  return (
    <>
      <AdminTopBar title="Visitor Analytics" user={session!.user} />
      <div className="p-6 space-y-6">

        {/* Period tabs */}
        <div className="flex items-center gap-2">
          {periods.map(p => (
            <Link
              key={p.key}
              href={`/admin/analytics?period=${p.key}`}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Page Views', value: totalViews,    icon: <Eye size={18} />,      color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Unique IPs', value: uniqueVisitors, icon: <Users size={18} />,    color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Today',      value: todayViews,    icon: <TrendingUp size={18} />, color: 'text-green-600',  bg: 'bg-green-50' },
            { label: 'Countries',  value: topCountries.length, icon: <Globe size={18} />, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500 font-medium">{s.label}</span>
                <span className={`${s.bg} ${s.color} p-2 rounded-lg`}>{s.icon}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Top pages */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Top Pages</h3>
            </div>
            <div className="p-4 space-y-2">
              {topPages.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No data yet</p>
              ) : topPages.map(p => (
                <div key={p.path} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-600 truncate flex-1" title={p.path}>{p.path}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${(p._count.path / maxPageViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{p._count.path}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top countries */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Top Countries</h3>
            </div>
            <div className="p-4 space-y-2">
              {topCountries.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No data yet</p>
              ) : topCountries.map(c => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-base leading-none">{countryFlag(c.country ?? 'XX')}</span>
                  <span className="text-sm text-slate-700 flex-1">{countryName(c.country)}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-orange-400 h-1.5 rounded-full"
                        style={{ width: `${(c._count.country / maxCountryViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{c._count.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent visitors */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Visitors</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">IP</th>
                  <th className="text-left px-5 py-3 font-medium">Country</th>
                  <th className="text-left px-5 py-3 font-medium">City</th>
                  <th className="text-left px-5 py-3 font-medium">Page</th>
                  <th className="text-left px-5 py-3 font-medium">Referrer</th>
                  <th className="text-left px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">No visitors recorded yet</td>
                  </tr>
                ) : recentVisitors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{v.ip}</td>
                    <td className="px-5 py-3 text-slate-700">
                      {v.country
                        ? <span title={countryName(v.country)}>{countryFlag(v.country)} {v.country}</span>
                        : <span className="text-slate-400">—</span>
                      }
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{v.city ?? '—'}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-700 max-w-[200px] truncate" title={v.path}>{v.path}</td>
                    <td className="px-5 py-3 text-xs text-slate-400 max-w-[160px] truncate" title={v.referrer ?? ''}>
                      {v.referrer ? new URL(v.referrer).hostname : '—'}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {v.createdAt.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
