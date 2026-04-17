import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateFAQ } from '@/lib/admin/faq-actions'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const categories = ['General', 'Services', 'Pricing', 'Technology', 'Support', 'Partnership']

interface Props { params: Promise<{ id: string }> }

export default async function EditFAQPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  let faq
  try { faq = await prisma.fAQ.findUnique({ where: { id } }) } catch { faq = null }
  if (!faq) notFound()
  const action = updateFAQ.bind(null, id)

  return (
    <>
      <AdminTopBar title="Edit FAQ" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/faqs" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5"><ChevronLeft size={16} /> Back</Link>
        <form action={action} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">FAQ Details</h2>
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-1">Question <span className="text-red-500">*</span></label>
              <input id="question" name="question" type="text" required defaultValue={faq.question} className={ic} />
            </div>
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-1">Answer <span className="text-red-500">*</span></label>
              <textarea id="answer" name="answer" rows={6} required defaultValue={faq.answer} className={ic + ' resize-y'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select id="category" name="category" defaultValue={faq.category ?? ''} className={ic}>
                  <option value="">— None —</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={faq.sortOrder} min={0} className={ic} />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="active" type="checkbox" defaultChecked={faq.active} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Active (show on site)</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            <Link href="/admin/faqs" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
