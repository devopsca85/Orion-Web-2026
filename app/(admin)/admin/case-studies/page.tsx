import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import { deleteCaseStudy } from '@/lib/admin/case-study-actions'
import Link from 'next/link'
import { Plus, Pencil, Star } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function CaseStudiesPage() {
  const session = await auth()
  let studies: Awaited<ReturnType<typeof prisma.caseStudy.findMany>> = []
  let dbError = false
  try {
    studies = await prisma.caseStudy.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
  } catch {
    dbError = true
  }

  return (
    <>
      <AdminTopBar title="Case Studies" user={session!.user} />
      <div className="p-6">
        {dbError && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            <strong>Database table not ready.</strong> Run <code className="bg-amber-100 px-1 rounded">npm run db:push</code> on the server to create the case_studies table.
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{studies.length} case {studies.length === 1 ? 'study' : 'studies'}</p>
          <Link href="/admin/case-studies/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={15} /> New Case Study
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Client</th>
                <th className="text-left px-5 py-3 font-medium">Industry</th>
                <th className="text-left px-5 py-3 font-medium">Sort</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No case studies yet. <Link href="/admin/case-studies/new" className="text-indigo-600 hover:underline">Add one</Link>.
                  </td>
                </tr>
              ) : studies.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800 max-w-[240px]">
                    <div className="flex items-center gap-1.5">
                      {s.featured && <Star size={13} className="text-amber-400 shrink-0" fill="currentColor" />}
                      <span className="truncate">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{s.client}</td>
                  <td className="px-5 py-3 text-slate-500">{s.industry}</td>
                  <td className="px-5 py-3 text-slate-400">{s.sortOrder}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {s.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/case-studies/${s.id}`} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                        <Pencil size={11} /> Edit
                      </Link>
                      <DeleteButton action={deleteCaseStudy.bind(null, s.id)} label="Delete" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
