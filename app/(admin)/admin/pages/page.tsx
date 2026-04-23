import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deletePage } from '@/lib/admin/page-actions'
import Link from 'next/link'
import { Plus, Pencil, Eye } from 'lucide-react'

const PAGES_PER_PAGE = 20

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-yellow-100 text-yellow-700',
  ARCHIVED: 'bg-slate-100 text-slate-600',
}

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function PagesAdminPage({ searchParams }: Props) {
  const session = await auth()
  const { status, page } = await searchParams
  const currentPage = parseInt(page ?? '1') || 1
  const where = status && status !== 'all' ? { status: status as import('@prisma/client').PostStatus } : {}

  let pages: Awaited<ReturnType<typeof prisma.page.findMany>> = []
  let total = 0
  try {
    ;[pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (currentPage - 1) * PAGES_PER_PAGE,
        take: PAGES_PER_PAGE,
      }),
      prisma.page.count({ where }),
    ])
  } catch {
    // Table not yet created — show empty state until `prisma db push` is run
  }

  const totalPages = Math.ceil(total / PAGES_PER_PAGE)
  const statuses = ['all', 'PUBLISHED', 'DRAFT', 'ARCHIVED']

  return (
    <>
      <AdminTopBar title="Pages" user={session!.user} />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {total} page{total !== 1 ? 's' : ''} total
          </p>
          <Link
            href="/admin/pages/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Page
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/admin/pages?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                (status ?? 'all') === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Slug</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Template</th>
                  <th className="text-left px-5 py-3 font-medium">Sort</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      No pages found.{' '}
                      <Link href="/admin/pages/new" className="text-indigo-600 hover:underline">
                        Create one
                      </Link>
                      .
                    </td>
                  </tr>
                ) : (
                  pages.map((p) => {
                    const deleteAction = deletePage.bind(null, p.id)
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800 max-w-xs">
                          <Link
                            href={`/admin/pages/${p.id}`}
                            className="hover:text-indigo-600 truncate block"
                          >
                            {p.title}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                          /{p.slug}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] ?? ''}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500 capitalize">{p.template}</td>
                        <td className="px-5 py-3 text-slate-400 text-center">{p.sortOrder}</td>
                        <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                          {p.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/pages/${p.id}`}
                              className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors"
                            >
                              <Pencil size={13} /> Edit
                            </Link>
                            {p.status === 'PUBLISHED' && (
                              <Link
                                href={`/${p.slug}`}
                                target="_blank"
                                className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-emerald-50 transition-colors"
                              >
                                <Eye size={13} /> Preview
                              </Link>
                            )}
                            <DeleteForm action={deleteAction} />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/admin/pages?status=${status ?? 'all'}&page=${currentPage - 1}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Previous
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/admin/pages?status=${status ?? 'all'}&page=${currentPage + 1}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
