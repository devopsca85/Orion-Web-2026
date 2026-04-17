import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { updatePage } from '@/lib/admin/page-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye } from 'lucide-react'

const templates = [
  { value: 'default', label: 'Default' },
  { value: 'full-width', label: 'Full Width' },
  { value: 'landing', label: 'Landing' },
  { value: 'narrow', label: 'Narrow' },
]

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPageAdminPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) notFound()

  const updateWithId = updatePage.bind(null, page.id)

  return (
    <>
      <AdminTopBar title="Edit Page" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/admin/pages"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Pages
          </Link>
          {page.status === 'PUBLISHED' && (
            <Link
              href={`/pages/${page.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <Eye size={15} /> View Live
            </Link>
          )}
        </div>

        <form action={updateWithId} className="space-y-6">
          {/* Page Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Page Details
            </h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={page.title}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
                Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">/pages/</span>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  defaultValue={page.slug}
                  className="block flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">
                Excerpt{' '}
                <span className="text-slate-400 text-xs font-normal">(optional, max 500 chars)</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                maxLength={500}
                defaultValue={page.excerpt ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                name="content"
                content={page.content}
                placeholder="Write your page content..."
                minHeight="500px"
              />
            </div>
          </div>

          {/* Page Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Page Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-slate-700 mb-1">
                  Template
                </label>
                <select
                  id="template"
                  name="template"
                  defaultValue={page.template}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  {templates.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={page.status}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">
                  Sort Order
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={page.sortOrder}
                  min={0}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              SEO
            </h2>

            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700 mb-1">
                Meta Title{' '}
                <span className="text-slate-400 text-xs font-normal">(max 70 chars)</span>
              </label>
              <input
                id="metaTitle"
                name="metaTitle"
                type="text"
                maxLength={70}
                defaultValue={page.metaTitle ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="metaDesc" className="block text-sm font-medium text-slate-700 mb-1">
                Meta Description{' '}
                <span className="text-slate-400 text-xs font-normal">(max 160 chars)</span>
              </label>
              <textarea
                id="metaDesc"
                name="metaDesc"
                maxLength={160}
                rows={2}
                defaultValue={page.metaDesc ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
            <Link
              href="/admin/pages"
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
