import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { runSecurityAudit } from '@/lib/security-audit'
import { WorldMapWidget } from '@/components/admin/WorldMapWidget'
import Link from 'next/link'
import {
  FileText,
  Briefcase,
  Mail,
  Bell,
  Plus,
  ShieldCheck,
  BarChart2,
  Clock,
  History,
} from 'lucide-react'
import { ClearVisitorsButton } from '@/components/admin/ClearVisitorsButton'

const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
function countryFlag(code: string): string {
  return [...code.toUpperCase()].map((c) => String.fromCodePoint(0x1f1e0 + c.charCodeAt(0) - 65)).join('')
}
function countryName(code: string): string {
  try { return displayNames.of(code) ?? code } catch { return code }
}

export default async function AdminDashboard() {
  const session = await auth()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalPosts,
    totalPortfolio,
    newContacts,
    totalSubscribers,
    todayVisitors,
    scheduledCount,
    draftCount,
    recentContacts,
    recentPosts,
    recentRevisions,
    topCountries,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.portfolioItem.count(),
    prisma.contactSubmission.count({ where: { status: 'NEW' } }),
    prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
    prisma.pageView.count({ where: { createdAt: { gte: todayStart }, bot: false } }),
    prisma.blogPost.count({ where: { status: 'DRAFT', scheduledAt: { not: null } } }).catch(() => 0),
    prisma.blogPost.count({ where: { status: 'DRAFT' } }).catch(() => 0),
    prisma.contactSubmission.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    }),
    prisma.revision.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { entityType: true, entityId: true, title: true, editedBy: true, createdAt: true },
    }).catch(() => [] as never[]),
    prisma.pageView.groupBy({
      by: ['country'],
      where: { createdAt: { gte: since30d }, bot: false, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 20,
    }),
  ])

  // Fall back to all-time if last 30d has no country data
  const topCountriesRaw = topCountries.length > 0 ? topCountries : await prisma.pageView.groupBy({
    by: ['country'],
    where: { bot: false, country: { not: null } },
    _count: { country: true },
    orderBy: { _count: { country: 'desc' } },
    take: 20,
  })

  const audit = runSecurityAudit()

  const gradeColor =
    audit.score >= 90 ? 'text-green-600' :
    audit.score >= 75 ? 'text-orange-500' : 'text-red-600'

  const gradeBg =
    audit.score >= 90 ? 'bg-green-50' :
    audit.score >= 75 ? 'bg-orange-50' : 'bg-red-50'

  const stats = [
    { label: 'Total Posts',      value: totalPosts,       icon: <FileText  size={20} />, color: 'text-blue-600',   bg: 'bg-blue-50',   href: '/admin/blog' },
    { label: 'Portfolio Items',  value: totalPortfolio,   icon: <Briefcase size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/admin/portfolio' },
    { label: 'New Contacts',     value: newContacts,      icon: <Mail      size={20} />, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/contacts' },
    { label: 'Subscribers',      value: totalSubscribers, icon: <Bell      size={20} />, color: 'text-green-600',  bg: 'bg-green-50',  href: '/admin/subscribers' },
  ]

  const statusColors: Record<string, string> = {
    NEW:       'bg-blue-100 text-blue-700',
    REVIEWED:  'bg-yellow-100 text-yellow-700',
    RESPONDED: 'bg-purple-100 text-purple-700',
    CLOSED:    'bg-slate-100 text-slate-600',
    SPAM:      'bg-red-100 text-red-600',
  }

  const postStatusColors: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-700',
    DRAFT:     'bg-yellow-100 text-yellow-700',
    ARCHIVED:  'bg-slate-100 text-slate-600',
  }

  return (
    <>
      <AdminTopBar title="Dashboard" user={session!.user} />
      <div className="p-6 space-y-6">

        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome back, {session?.user.name?.split(' ')[0]}!
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with Orion eSolutions today.
          </p>
        </div>

        {/* Content stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
                <span className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Scheduled + Draft status row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
            <span className="bg-amber-50 text-amber-600 p-2 rounded-lg shrink-0"><Clock size={20} /></span>
            <div>
              <p className="text-sm text-slate-500 font-medium">Scheduled Posts</p>
              <p className="text-3xl font-bold text-slate-800">{scheduledCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">auto-publish pending</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
            <span className="bg-slate-100 text-slate-500 p-2 rounded-lg shrink-0"><FileText size={20} /></span>
            <div>
              <p className="text-sm text-slate-500 font-medium">Draft Posts</p>
              <p className="text-3xl font-bold text-slate-800">{draftCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">unpublished blog posts</p>
            </div>
          </div>
        </div>

        {/* Recent Revisions */}
        {recentRevisions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 p-5 border-b border-slate-100">
              <History size={16} className="text-slate-400" />
              <h3 className="font-semibold text-slate-800">Recent Edits</h3>
            </div>
            <ul className="divide-y divide-slate-100">
              {recentRevisions.map((rev, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800 truncate max-w-xs">{rev.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {rev.entityType === 'blog_post' ? 'Blog' : 'Page'} &middot; {rev.editedBy} &middot; {rev.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Security + Analytics overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Security score */}
          <Link
            href="/admin/security"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500 font-medium">Security Score</span>
              <span className={`${gradeBg} ${gradeColor} p-2 rounded-lg`}>
                <ShieldCheck size={20} />
              </span>
            </div>
            <div className="flex items-end gap-3">
              <p className={`text-5xl font-bold ${gradeColor}`}>{audit.grade}</p>
              <div className="mb-1">
                <p className="text-2xl font-bold text-slate-700">{audit.score}<span className="text-sm text-slate-400 font-normal">/100</span></p>
                <p className="text-xs text-slate-400">OWASP Top 10 · {audit.rules.filter(r => r.status === 'pass').length}/{audit.rules.length} rules passing</p>
              </div>
            </div>
            {audit.rules.filter(r => r.status === 'fail').length > 0 && (
              <p className="mt-3 text-xs text-red-600 bg-red-50 rounded px-2 py-1 inline-block">
                {audit.rules.filter(r => r.status === 'fail').length} critical issue{audit.rules.filter(r => r.status === 'fail').length > 1 ? 's' : ''} — view details
              </p>
            )}
          </Link>

          {/* Visitor analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500 font-medium">Visitors Today</span>
              <span className="bg-teal-50 text-teal-600 p-2 rounded-lg">
                <BarChart2 size={20} />
              </span>
            </div>
            <Link href="/admin/analytics">
              <p className="text-5xl font-bold text-slate-800 hover:text-teal-600 transition-colors">{todayVisitors.toLocaleString()}</p>
            </Link>
            <p className="text-xs text-slate-400 mt-1 mb-3">non-bot page views · <Link href="/admin/analytics" className="hover:underline">view full analytics</Link></p>
            <ClearVisitorsButton />
          </div>

        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Post
          </Link>
          <Link
            href="/admin/portfolio/new"
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Portfolio Item
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Mail size={15} /> View Contacts
          </Link>
        </div>

        {/* World Map — Global Reach */}
        <WorldMapWidget
          countries={topCountriesRaw.map((row) => ({
            code: row.country!,
            name: countryName(row.country!),
            flag: countryFlag(row.country!),
            visits: row._count.country,
          }))}
          totalCountries={topCountriesRaw.length}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Recent Contact Submissions</h3>
              <Link href="/admin/contacts" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Name</th>
                    <th className="text-left px-5 py-3 font-medium">Service</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentContacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">No contact submissions yet</td>
                    </tr>
                  ) : recentContacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                      <td className="px-5 py-3 text-slate-500">{c.service ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] ?? ''}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400">{c.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Recent Blog Posts</h3>
              <Link href="/admin/blog" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Title</th>
                    <th className="text-left px-5 py-3 font-medium">Author</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPosts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">No blog posts yet</td>
                    </tr>
                  ) : recentPosts.map((p) => (
                    <tr key={p.slug} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800 max-w-[200px] truncate">{p.title}</td>
                      <td className="px-5 py-3 text-slate-500">{p.author.name}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${postStatusColors[p.status] ?? ''}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400">{p.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
