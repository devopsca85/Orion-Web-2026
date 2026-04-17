import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateBlogPost } from '@/lib/admin/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const categories = ['Cloud', 'AI & Data', 'Cybersecurity', 'Digital Transformation', 'DevOps']

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug: id },
    include: { author: { select: { name: true } } },
  })

  if (!post) notFound()

  const updateWithSlug = updateBlogPost.bind(null, post.slug)
  const tagsString = Array.isArray(post.tags) ? (post.tags as string[]).join(', ') : ''

  return (
    <>
      <AdminTopBar title="Edit Blog Post" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link
          href="/admin/blog"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Blog Posts
        </Link>

        <form action={updateWithSlug} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Post Details</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={post.title}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Slug <span className="text-slate-400 text-xs font-normal">(read-only)</span>
              </label>
              <input
                type="text"
                value={post.slug}
                disabled
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-500"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                defaultValue={post.excerpt}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                Content <span className="text-slate-400 text-xs font-normal">(HTML supported)</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={16}
                defaultValue={post.content}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Metadata</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={post.category}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  defaultValue={post.status}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
                Tags <span className="text-slate-400 text-xs font-normal">(comma separated)</span>
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                defaultValue={tagsString}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Featured Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={post.imageUrl ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="readingTime" className="block text-sm font-medium text-slate-700 mb-1">
                  Reading Time (minutes)
                </label>
                <input
                  id="readingTime"
                  name="readingTime"
                  type="number"
                  defaultValue={post.readingTime}
                  min={1}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  defaultChecked={post.featured}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                  Featured post
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">SEO</h2>

            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700 mb-1">
                Meta Title <span className="text-slate-400 text-xs font-normal">(max 70 chars)</span>
              </label>
              <input
                id="metaTitle"
                name="metaTitle"
                type="text"
                maxLength={70}
                defaultValue={post.metaTitle ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="metaDesc" className="block text-sm font-medium text-slate-700 mb-1">
                Meta Description <span className="text-slate-400 text-xs font-normal">(max 160 chars)</span>
              </label>
              <textarea
                id="metaDesc"
                name="metaDesc"
                maxLength={160}
                rows={2}
                defaultValue={post.metaDesc ?? ''}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
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
              href="/admin/blog"
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
