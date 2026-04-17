import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createResource } from '@/lib/admin/actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const resourceTypes = ['Whitepaper', 'Webinar', 'Guide', 'Case Study', 'Report', 'Template', 'Video']
const topics = ['Cloud', 'AI & Data', 'Cybersecurity', 'DevOps', 'Digital Transformation', 'IT Strategy']

export default async function NewResourcePage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Resource" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/resources" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Resources
        </Link>

        <form action={createResource} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Resource Details</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input id="title" name="title" type="text" required className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">Slug <span className="text-slate-400 text-xs font-normal">(auto-generated)</span></label>
              <input id="slug" name="slug" type="text" placeholder="auto-generated" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select id="type" name="type" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                  {resourceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                <select id="topic" name="topic" className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
              <textarea id="excerpt" name="excerpt" rows={3} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" />
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <input id="coverImage" name="coverImage" type="url" placeholder="https://..." className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="watchUrl" className="block text-sm font-medium text-slate-700 mb-1">Watch/Download URL</label>
              <input id="watchUrl" name="watchUrl" type="url" placeholder="https://..." className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input id="gated" name="gated" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="gated" className="text-sm font-medium text-slate-700">Gated (requires form)</label>
              </div>
              <div className="flex items-center gap-2">
                <input id="published" name="published" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Create Resource</button>
            <Link href="/admin/resources" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
