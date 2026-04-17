import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import Link from 'next/link'
import {
  FileText,
  Briefcase,
  Mail,
  Bell,
  Plus,
} from 'lucide-react'

export default async function AdminDashboard() {
  const session = await auth()

  const [
    totalPosts,
    totalPortfolio,
    newContacts,
    totalSubscribers,
    recentContacts,
    recentPosts,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.portfolioItem.count(),
    prisma.contactSubmission.count({ where: { status: 'NEW' } }),
    prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
    prisma.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    }),
  ])

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: <FileText size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Portfolio Items', value: totalPortfolio, icon: <Briefcase size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'New Contacts', value: newContacts, icon: <Mail size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Subscribers', value: totalSubscribers, icon: <Bell size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    REVIEWED: 'bg-yellow-100 text-yellow-700',
    RESPONDED: 'bg-purple-100 text-purple-700',
    CLOSED: 'bg-slate-100 text-slate-600',
    SPAM: 'bg-red-100 text-red-600',
  }

  const postStatusColors: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-700',
    DRAFT: 'bg-yellow-100 text-yellow-700',
    ARCHIVED: 'bg-slate-100 text-slate-600',
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
            Here&apos;s what&apos;s happening with Orion Solutions today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
                <span className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          ))}
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
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                        No contact submissions yet
                      </td>
                    </tr>
                  ) : (
                    recentContacts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                        <td className="px-5 py-3 text-slate-500">{c.service ?? '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] ?? ''}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400">
                          {c.createdAt.toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
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
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                        No blog posts yet
                      </td>
                    </tr>
                  ) : (
                    recentPosts.map((p) => (
                      <tr key={p.slug} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800 max-w-[200px] truncate">{p.title}</td>
                        <td className="px-5 py-3 text-slate-500">{p.author.name}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${postStatusColors[p.status] ?? ''}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400">
                          {p.createdAt.toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
