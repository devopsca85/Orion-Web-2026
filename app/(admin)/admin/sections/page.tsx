import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteHtmlSection, toggleHtmlSection } from '@/lib/admin/html-section-actions'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'

export default async function SectionsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await auth()

  let sections: Awaited<ReturnType<typeof prisma.htmlSection.findMany>> = []
  try {
    sections = await prisma.htmlSection.findMany({
      orderBy: [{ pageSlug: 'asc' }, { sortOrder: 'asc' }],
    })
  } catch { /* table not yet created */ }

  // Group by pageSlug
  const grouped = sections.reduce<Record<string, typeof sections>>((acc, s) => {
    if (!acc[s.pageSlug]) acc[s.pageSlug] = []
    acc[s.pageSlug].push(s)
    return acc
  }, {})

  return (
    <>
      <AdminTopBar title="HTML Sections" user={session!.user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {sections.length} section{sections.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} page{Object.keys(grouped).length !== 1 ? 's' : ''}
          </p>
          <Link
            href="/admin/sections/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Section
          </Link>
        </div>

        {sections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-16 text-center text-slate-400">
            No sections yet.{' '}
            <Link href="/admin/sections/new" className="text-indigo-600 hover:underline">
              Create your first section
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([pageSlug, pageSections]) => (
              <div key={pageSlug}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Page: <span className="text-indigo-600">/{pageSlug === 'home' ? '' : pageSlug}</span>
                  </h2>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">{pageSections.length} section{pageSections.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <th className="text-left px-5 py-3 font-medium">Section Name</th>
                        <th className="text-left px-5 py-3 font-medium">Sort</th>
                        <th className="text-left px-5 py-3 font-medium">Status</th>
                        <th className="text-left px-5 py-3 font-medium">Updated</th>
                        <th className="text-left px-5 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pageSections.map((section) => {
                        const deleteAction = deleteHtmlSection.bind(null, section.id)
                        const toggleAction = toggleHtmlSection.bind(null, section.id, !section.active)
                        return (
                          <tr key={section.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3 font-medium text-slate-800">
                              <Link href={`/admin/sections/${section.id}`} className="hover:text-indigo-600">
                                {section.name}
                              </Link>
                            </td>
                            <td className="px-5 py-3 text-slate-400 text-center">{section.sortOrder}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                section.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {section.active ? 'Active' : 'Hidden'}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                              {section.updatedAt.toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/sections/${section.id}`}
                                  className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors"
                                >
                                  <Pencil size={13} /> Edit
                                </Link>
                                <form action={toggleAction}>
                                  <button
                                    type="submit"
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 transition-colors ${
                                      section.active
                                        ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                                        : 'text-slate-600 hover:text-green-600 hover:bg-green-50'
                                    }`}
                                  >
                                    {section.active ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Show</>}
                                  </button>
                                </form>
                                <DeleteForm action={deleteAction} />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
