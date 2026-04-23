import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { prisma } from '@/lib/prisma'
import { deleteAward } from '@/lib/admin/award-actions'
import Link from 'next/link'
import { Plus, CheckCircle, Pencil, Trophy } from 'lucide-react'

interface Props { searchParams: Promise<{ saved?: string }> }

export default async function AwardsPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  let awards: { id: string; title: string; issuer: string; year: number | null; sortOrder: number; active: boolean }[] = []
  try {
    awards = await prisma.award.findMany({
      orderBy: [{ sortOrder: 'asc' }],
      select: { id: true, title: true, issuer: true, year: true, sortOrder: true, active: true },
    })
  } catch { /* table not yet migrated */ }

  return (
    <>
      <AdminTopBar title="Awards & Recognitions" user={session!.user} />
      <div className="p-6 max-w-5xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" /> Award saved successfully.
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{awards.length} award{awards.length !== 1 ? 's' : ''}</p>
          <Link href="/admin/awards/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Add Award
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-8" />
                <th className="text-left px-4 py-3 font-medium text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Issuer</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Year</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {awards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No awards yet. <Link href="/admin/awards/new" className="text-indigo-600 hover:underline">Add one</Link>.
                  </td>
                </tr>
              ) : awards.map((award) => {
                const deleteAction = deleteAward.bind(null, award.id)
                return (
                  <tr key={award.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-amber-400"><Trophy size={16} /></td>
                    <td className="px-4 py-3 font-medium text-slate-800">{award.title}</td>
                    <td className="px-4 py-3 text-slate-500">{award.issuer}</td>
                    <td className="px-4 py-3 text-slate-500">{award.year}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${award.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {award.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/awards/${award.id}`} className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors">
                          <Pencil size={13} /> Edit
                        </Link>
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
    </>
  )
}
