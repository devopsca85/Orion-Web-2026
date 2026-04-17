import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createPortfolioItem } from '@/lib/admin/actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewPortfolioItemPage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Portfolio Item" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link
          href="/admin/portfolio"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Portfolio
        </Link>

        <form action={createPortfolioItem} className="space-y-6">
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
                  placeholder="Project title"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  placeholder="auto-generated"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-slate-700 mb-1">
                  Client
                </label>
                <input
                  id="client"
                  name="client"
                  type="text"
                  placeholder="Client name"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-1">
                  Industry
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  placeholder="e.g. Healthcare"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">
                  Service
                </label>
                <input
                  id="service"
                  name="service"
                  type="text"
                  placeholder="e.g. Cloud Migration"
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Case Study</h2>

            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-slate-700 mb-1">
                Challenge
              </label>
              <textarea
                id="challenge"
                name="challenge"
                rows={4}
                placeholder="Describe the challenge..."
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-slate-700 mb-1">
                Solution
              </label>
              <textarea
                id="solution"
                name="solution"
                rows={4}
                placeholder="Describe the solution..."
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div>
              <label htmlFor="outcome" className="block text-sm font-medium text-slate-700 mb-1">
                Outcome
              </label>
              <textarea
                id="outcome"
                name="outcome"
                rows={4}
                placeholder="Describe the outcome..."
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg">Additional Details</h2>

            <div>
              <label htmlFor="metrics" className="block text-sm font-medium text-slate-700 mb-1">
                Metrics <span className="text-slate-400 text-xs font-normal">(JSON array, e.g. {`[{"label":"Uptime","value":"99.9%"}]`})</span>
              </label>
              <textarea
                id="metrics"
                name="metrics"
                rows={3}
                defaultValue="[]"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y font-mono"
              />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-slate-700 mb-1">
                Technologies <span className="text-slate-400 text-xs font-normal">(comma separated)</span>
              </label>
              <input
                id="technologies"
                name="technologies"
                type="text"
                placeholder="AWS, React, Node.js"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://..."
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">Featured</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Create Item
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
