import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createService } from '@/lib/admin/actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewServicePage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Service" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link
          href="/admin/services"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Services
        </Link>

        <form action={createService} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Service Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input id="title" name="title" type="text" required className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input id="slug" name="slug" type="text" placeholder="auto-generated" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>

            <div>
              <label htmlFor="shortDesc" className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
              <input id="shortDesc" name="shortDesc" type="text" placeholder="One-liner description" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
              <textarea id="description" name="description" rows={6} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-slate-700 mb-1">Icon Name <span className="text-slate-400 text-xs font-normal">(Lucide icon name)</span></label>
              <input id="icon" name="icon" type="text" placeholder="Cloud" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-slate-700 mb-1">
                Features <span className="text-slate-400 text-xs font-normal">(JSON string array, e.g. [&quot;Feature 1&quot;,&quot;Feature 2&quot;])</span>
              </label>
              <textarea id="features" name="features" rows={3} defaultValue='[]' className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono" />
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-slate-700 mb-1">
                Benefits <span className="text-slate-400 text-xs font-normal">(JSON string array)</span>
              </label>
              <textarea id="benefits" name="benefits" rows={3} defaultValue='[]' className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono" />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-slate-700 mb-1">
                Technologies <span className="text-slate-400 text-xs font-normal">(JSON string array)</span>
              </label>
              <textarea id="technologies" name="technologies" rows={3} defaultValue='[]' className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Hero Section</h2>
            <p className="text-xs text-slate-500 -mt-3">Controls the large two-column header shown on this service page.</p>

            <div>
              <label htmlFor="heroBadge" className="block text-sm font-medium text-slate-700 mb-1">
                Hero Badge <span className="text-slate-400 text-xs font-normal">(e.g. "ChatGPT & Co-Pilot")</span>
              </label>
              <input id="heroBadge" name="heroBadge" type="text" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroHighlight" className="block text-sm font-medium text-slate-700 mb-1">
                Title Highlight <span className="text-slate-400 text-xs font-normal">(exact words in title to colour orange)</span>
              </label>
              <input id="heroHighlight" name="heroHighlight" type="text" placeholder="Web Development Company" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroSubtext" className="block text-sm font-medium text-slate-700 mb-1">
                Hero Subtext <span className="text-slate-400 text-xs font-normal">(e.g. "12+ Years | Diverse Expertise | 24×7 Support")</span>
              </label>
              <input id="heroSubtext" name="heroSubtext" type="text" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroImageUrl" className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
              <input id="heroImageUrl" name="heroImageUrl" type="text" placeholder="/assets/images/services/hero.png" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroStats" className="block text-sm font-medium text-slate-700 mb-1">
                Stats <span className="text-slate-400 text-xs font-normal">(one per line: "700+ | Satisfied Clients")</span>
              </label>
              <textarea
                id="heroStats" name="heroStats" rows={4}
                placeholder={"700+ | Satisfied Clients\n12+ | Years of Success\n500+ | Projects Delivered\n3 | Global Locations"}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">SEO & Settings</h2>

            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
              <input id="metaTitle" name="metaTitle" type="text" maxLength={70} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
              <textarea id="metaDescription" name="metaDescription" rows={2} maxLength={160} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input id="published" name="published" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Create Service</button>
            <Link href="/admin/services" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
