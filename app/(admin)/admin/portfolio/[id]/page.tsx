import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { MetricsEditor } from '@/components/admin/MetricsEditor'
import { updatePortfolioItem } from '@/lib/admin/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Info } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPortfolioItemPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const item = await prisma.portfolioItem.findUnique({ where: { slug: id } })
  if (!item) notFound()

  const updateWithSlug = updatePortfolioItem.bind(null, item.slug)
  const techString = Array.isArray(item.technologies) ? (item.technologies as string[]).join(', ') : ''
  const existingMetrics = Array.isArray(item.metrics)
    ? (item.metrics as { value: string; label: string }[])
    : []

  return (
    <>
      <AdminTopBar title="Edit Portfolio Item" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link
          href="/admin/portfolio"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Portfolio
        </Link>

        <form action={updateWithSlug} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Basic Info</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={item.title}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug <span className="text-slate-400 text-xs font-normal ml-1">— changes the URL</span></label>
                <input
                  name="slug"
                  type="text"
                  defaultValue={item.slug}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                <input
                  id="client"
                  name="client"
                  type="text"
                  defaultValue={item.client}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  defaultValue={item.industry}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">Service</label>
                <input
                  id="service"
                  name="service"
                  type="text"
                  defaultValue={item.service}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Case Study</h2>

            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-slate-700 mb-1">Challenge</label>
              <textarea
                id="challenge"
                name="challenge"
                rows={4}
                defaultValue={item.challenge}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-slate-700 mb-1">Solution</label>
              <textarea
                id="solution"
                name="solution"
                rows={4}
                defaultValue={item.solution}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label htmlFor="outcome" className="block text-sm font-medium text-slate-700 mb-1">Outcome</label>
              <textarea
                id="outcome"
                name="outcome"
                rows={4}
                defaultValue={item.outcome}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Additional Details</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Key Metrics</label>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3 text-xs text-blue-700">
                <Info size={13} className="shrink-0 mt-0.5" />
                Up to 4 stats shown on the card — e.g. &ldquo;10x faster&rdquo; / &ldquo;Deployment Frequency&rdquo;
              </div>
              <MetricsEditor defaultMetrics={existingMetrics} />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-slate-700 mb-1">
                Technologies <span className="text-slate-400 text-xs font-normal">(comma separated)</span>
              </label>
              <input
                id="technologies"
                name="technologies"
                type="text"
                defaultValue={techString}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={item.imageUrl ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  defaultChecked={item.featured}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">Featured</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  defaultChecked={item.published}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
            <Link
              href="/admin/portfolio"
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
