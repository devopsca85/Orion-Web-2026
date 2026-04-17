import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateResource } from '@/lib/admin/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const resourceTypes = ['Whitepaper', 'Webinar', 'Guide', 'Case Study', 'Report', 'Template', 'Video']
const topics = ['Cloud', 'AI & Data', 'Cybersecurity', 'DevOps', 'Digital Transformation', 'IT Strategy']

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditResourcePage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const resource = await prisma.resource.findUnique({ where: { id } })
  if (!resource) notFound()

  const updateWithId = updateResource.bind(null, resource.id)

  return (
    <>
      <AdminTopBar title="Edit Resource" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/resources" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Resources
        </Link>

        <form action={updateWithId} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Resource Details</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input id="title" name="title" type="text" required defaultValue={resource.title} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select id="type" name="type" defaultValue={resource.type} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                  {resourceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                <select id="topic" name="topic" defaultValue={resource.topic} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
              <textarea id="excerpt" name="excerpt" rows={3} defaultValue={resource.excerpt} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" />
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <input id="coverImage" name="coverImage" type="url" defaultValue={resource.coverImage ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="watchUrl" className="block text-sm font-medium text-slate-700 mb-1">Watch/Download URL</label>
              <input id="watchUrl" name="watchUrl" type="url" defaultValue={resource.watchUrl ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input id="gated" name="gated" type="checkbox" defaultChecked={resource.gated} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="gated" className="text-sm font-medium text-slate-700">Gated</label>
              </div>
              <div className="flex items-center gap-2">
                <input id="published" name="published" type="checkbox" defaultChecked={resource.published} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            <Link href="/admin/resources" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
