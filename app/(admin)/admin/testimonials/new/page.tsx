import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createTestimonial } from '@/lib/admin/testimonial-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const inputClass = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function NewTestimonialPage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Testimonial" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/testimonials"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Testimonials
        </Link>

        <form action={createTestimonial} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-base border-b border-slate-100 pb-3">
              Testimonial Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input id="name" name="name" type="text" required placeholder="Sarah Mitchell" className={inputClass} />
              </div>
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-slate-700 mb-1">
                  Rating
                </label>
                <select id="rating" name="rating" defaultValue="5" className={inputClass}>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input id="title" name="title" type="text" required placeholder="CTO" className={inputClass} />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input id="company" name="company" type="text" required placeholder="Acme Corp" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="quote" className="block text-sm font-medium text-slate-700 mb-1">
                Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                id="quote"
                name="quote"
                rows={5}
                required
                placeholder="What did they say about working with you?"
                className={inputClass + ' resize-y'}
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-slate-700 mb-1">
                Avatar URL <span className="text-slate-400 text-xs font-normal">(optional)</span>
              </label>
              <input id="avatar" name="avatar" type="text" placeholder="https://..." className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">
                  Sort Order
                </label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} className={inputClass} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input id="active" name="active" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-slate-700">Active (show on site)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Testimonial
            </button>
            <Link href="/admin/testimonials" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
