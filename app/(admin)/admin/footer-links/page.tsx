import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import { deleteFooterLink } from '@/lib/admin/footer-link-actions'
import { CheckCircle, Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ saved?: string }>
}

export default async function FooterLinksPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams
  let links: Awaited<ReturnType<typeof prisma.footerLink.findMany>> = []
  try {
    links = await prisma.footerLink.findMany({
      orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }, { label: 'asc' }],
    })
  } catch {
    // table may not exist yet — run prisma db push on the server
  }

  const groups = Array.from(new Set(links.map((l) => l.group)))

  return (
    <>
      <AdminTopBar title="Footer Links" user={session!.user} />
      <div className="p-6 max-w-4xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Footer link saved.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{links.length} link{links.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/footer-links/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Link
          </Link>
        </div>

        {links.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-12 text-center text-slate-400 text-sm">
            No footer links yet. Click &ldquo;Add Link&rdquo; to create one.
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{group}</span>
                </div>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {links.filter((l) => l.group === group).map((link) => (
                      <tr key={link.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{link.label}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-xs">{link.href}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${link.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {link.active ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Link
                              href={`/admin/footer-links/${link.id}`}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                              <Pencil size={14} />
                            </Link>
                            <form action={deleteFooterLink.bind(null, link.id)}>
                              <button
                                type="submit"
                                className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                                onClick={(e) => { if (!confirm('Delete this link?')) e.preventDefault() }}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
