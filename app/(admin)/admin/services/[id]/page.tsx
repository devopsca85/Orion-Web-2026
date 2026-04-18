import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateService } from '@/lib/admin/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const service = await prisma.service.findUnique({ where: { slug: id } })
  if (!service) notFound()

  const updateWithSlug = updateService.bind(null, service.slug)

  return (
    <>
      <AdminTopBar title="Edit Service" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link href="/admin/services" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Services
        </Link>

        <form action={updateWithSlug} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Service Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input id="title" name="title" type="text" required defaultValue={service.title} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (read-only)</label>
                <input type="text" value={service.slug} disabled className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-500" />
              </div>
            </div>

            <div>
              <label htmlFor="shortDesc" className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
              <input id="shortDesc" name="shortDesc" type="text" defaultValue={service.shortDesc} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
              <textarea id="description" name="description" rows={6} defaultValue={service.description} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-slate-700 mb-1">Icon Name</label>
              <input id="icon" name="icon" type="text" defaultValue={service.icon} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-slate-700 mb-1">Features <span className="text-slate-400 text-xs font-normal">(JSON string array)</span></label>
              <textarea id="features" name="features" rows={3} defaultValue={JSON.stringify(service.features, null, 2)} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono" />
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-slate-700 mb-1">Benefits <span className="text-slate-400 text-xs font-normal">(JSON string array)</span></label>
              <textarea id="benefits" name="benefits" rows={3} defaultValue={JSON.stringify(service.benefits, null, 2)} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono" />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-slate-700 mb-1">Technologies <span className="text-slate-400 text-xs font-normal">(JSON string array)</span></label>
              <textarea id="technologies" name="technologies" rows={3} defaultValue={JSON.stringify(service.technologies, null, 2)} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Hero Section</h2>
            <p className="text-xs text-slate-500 -mt-3">Controls the large two-column header shown on this service page.</p>

            <div>
              <label htmlFor="heroBadge" className="block text-sm font-medium text-slate-700 mb-1">
                Hero Badge <span className="text-slate-400 text-xs font-normal">(e.g. &quot;ChatGPT &amp; Co-Pilot&quot;)</span>
              </label>
              <input id="heroBadge" name="heroBadge" type="text" defaultValue={service.heroBadge ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroHighlight" className="block text-sm font-medium text-slate-700 mb-1">
                Title Highlight <span className="text-slate-400 text-xs font-normal">(exact words to colour orange)</span>
              </label>
              <input id="heroHighlight" name="heroHighlight" type="text" defaultValue={service.heroHighlight ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroSubtext" className="block text-sm font-medium text-slate-700 mb-1">
                Hero Subtext <span className="text-slate-400 text-xs font-normal">(e.g. &quot;12+ Years | Diverse Expertise | 24×7 Support&quot;)</span>
              </label>
              <input id="heroSubtext" name="heroSubtext" type="text" defaultValue={service.heroSubtext ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroImageUrl" className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
              <input id="heroImageUrl" name="heroImageUrl" type="text" defaultValue={service.heroImageUrl ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="heroStats" className="block text-sm font-medium text-slate-700 mb-1">
                Stats <span className="text-slate-400 text-xs font-normal">(one per line: &quot;700+ | Satisfied Clients&quot;)</span>
              </label>
              <textarea
                id="heroStats" name="heroStats" rows={4}
                defaultValue={
                  Array.isArray(service.heroStats)
                    ? (service.heroStats as {value:string;label:string}[]).map((s) => `${s.value} | ${s.label}`).join('\n')
                    : ''
                }
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">SEO & Settings</h2>

            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
              <input id="metaTitle" name="metaTitle" type="text" maxLength={70} defaultValue={service.metaTitle ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
              <textarea id="metaDescription" name="metaDescription" rows={2} maxLength={160} defaultValue={service.metaDescription ?? ''} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={service.sortOrder} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input id="published" name="published" type="checkbox" defaultChecked={service.published} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            <Link href="/admin/services" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  )
}
