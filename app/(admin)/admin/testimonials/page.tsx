import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, CheckCircle, Pencil, Trash2, Star } from 'lucide-react'
import { deleteTestimonial } from '@/lib/admin/testimonial-actions'

interface Props {
  searchParams: Promise<{ saved?: string }>
}

export default async function TestimonialsAdminPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  let testimonials: {
    id: string; name: string; title: string; company: string;
    rating: number; sortOrder: number; active: boolean
  }[] = []

  try {
    testimonials = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, name: true, title: true, company: true, rating: true, sortOrder: true, active: true },
    })
  } catch {
    // table not yet migrated
  }

  return (
    <>
      <AdminTopBar title="Testimonials" user={session!.user} />
      <div className="p-6 max-w-5xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Testimonial saved successfully.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</p>
          <Link
            href="/admin/testimonials/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Testimonial
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-400 mb-4">No testimonials yet.</p>
            <Link
              href="/admin/testimonials/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add your first testimonial
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Role / Company</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Rating</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {t.title} · {t.company}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{t.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/testimonials/${t.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <form action={async () => { 'use server'; await deleteTestimonial(t.id) }}>
                          <button
                            type="submit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete this testimonial"
                          >
                            <Trash2 size={15} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {testimonials.length === 0 && (
          <p className="mt-4 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            If the table is missing, run <code>npx prisma db push</code> to apply the new schema.
          </p>
        )}
      </div>
    </>
  )
}
