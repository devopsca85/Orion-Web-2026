import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { prisma } from '@/lib/prisma'
import { deleteForm } from '@/lib/admin/form-actions'
import Link from 'next/link'
import { Plus, CheckCircle, Pencil, FormInput, Copy } from 'lucide-react'

interface Props { searchParams: Promise<{ saved?: string }> }

export default async function FormsPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  let forms: { id: string; name: string; slug: string; title: string; active: boolean; _count: { submissions: number } }[] = []
  try {
    forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, slug: true, title: true, active: true, _count: { select: { submissions: true } } },
    })
  } catch { /* table not yet migrated */ }

  return (
    <>
      <AdminTopBar title="Forms" user={session!.user} />
      <div className="p-6 max-w-5xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" /> Form saved.
          </div>
        )}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex-1">
            <p className="font-semibold mb-1">How to embed a form on a page</p>
            <p className="font-mono text-xs bg-white border border-blue-100 rounded px-2 py-1 mt-1 inline-block">{`<DynamicForm slug="your-form-slug" />`}</p>
          </div>
          <Link href="/admin/forms/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus size={16} /> New Form
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Submissions</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    No forms yet. <Link href="/admin/forms/new" className="text-indigo-600 hover:underline">Create one</Link>.
                  </td>
                </tr>
              ) : forms.map((form) => {
                const deleteAction = deleteForm.bind(null, form.id)
                return (
                  <tr key={form.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FormInput size={15} className="text-slate-400 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-800">{form.name}</p>
                          <p className="text-xs text-slate-400">{form.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{form.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{form._count.submissions}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${form.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/forms/${form.id}/submissions`} className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors">
                          <Copy size={13} /> Submissions
                        </Link>
                        <Link href={`/admin/forms/${form.id}`} className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors">
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
