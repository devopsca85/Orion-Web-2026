import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props { params: Promise<{ id: string }> }

export default async function FormSubmissionsPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      submissions: { orderBy: { createdAt: 'desc' }, take: 200 },
    },
  })
  if (!form) notFound()

  const fields = Array.isArray(form.fields) ? (form.fields as { name: string; label: string }[]) : []

  return (
    <>
      <AdminTopBar title={`Submissions — ${form.name}`} user={session!.user} />
      <div className="p-6 max-w-7xl">
        <Link href="/admin/forms" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ChevronLeft size={15} /> Back to Forms
        </Link>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">{form.submissions.length} submission{form.submissions.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">Date</th>
                {fields.map((f) => (
                  <th key={f.name} className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {form.submissions.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 1} className="px-4 py-12 text-center text-slate-400">No submissions yet.</td>
                </tr>
              ) : form.submissions.map((sub) => {
                const data = (sub.data as Record<string, string>) || {}
                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    {fields.map((f) => (
                      <td key={f.name} className="px-4 py-3 text-slate-700 max-w-xs">
                        <span className="truncate block">{data[f.name] ?? '—'}</span>
                      </td>
                    ))}
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
