import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { MetricsEditor } from '@/components/admin/MetricsEditor'
import { createPortfolioItem } from '@/lib/admin/actions'
import Link from 'next/link'
import { ChevronLeft, Info } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const ta = ic + ' resize-y'

const INDUSTRIES = [
  'Technology','Financial Services','Healthcare','Retail & E-Commerce',
  'Manufacturing','Government','Education','Telecom','Energy','Logistics','Other',
]

export default async function NewPortfolioItemPage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Portfolio Item" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link href="/admin/portfolio" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Portfolio
        </Link>

        <form action={createPortfolioItem} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 text-base border-b border-slate-100 pb-3">Basic Info</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Title <span className="text-red-500">*</span></label>
              <input name="title" type="text" required placeholder="e.g. FinTech Platform Modernization" className={ic} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                <input name="client" type="text" placeholder="e.g. Regional Bank" className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <select name="industry" className={ic}>
                  <option value="">Select…</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service / Category</label>
                <input name="service" type="text" placeholder="e.g. Cloud Migration" className={ic} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <input name="imageUrl" type="url" placeholder="https://..." className={ic} />
              <p className="text-xs text-slate-400 mt-1">Shown as the card thumbnail. Leave blank to use a gradient placeholder.</p>
            </div>
          </div>

          {/* Case Study Content */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 text-base border-b border-slate-100 pb-3">Case Study Content</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Challenge <span className="text-red-500">*</span></label>
              <textarea name="challenge" required rows={4} placeholder="What problem did the client face before working with Orion eSolutions?" className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Solution <span className="text-red-500">*</span></label>
              <textarea name="solution" required rows={4} placeholder="How did Orion eSolutions solve it? What technologies and approach were used?" className={ta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Outcome / Results <span className="text-red-500">*</span></label>
              <textarea name="outcome" required rows={4} placeholder="What were the measurable business results?" className={ta} />
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-800 text-base border-b border-slate-100 pb-3 mb-4">Key Metrics</h2>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4 text-xs text-blue-700">
                <Info size={13} className="shrink-0 mt-0.5" />
                Add up to 4 headline stats shown on the card — e.g. &ldquo;10x faster&rdquo; / &ldquo;Deployment Frequency&rdquo;
              </div>
              <MetricsEditor />
            </div>
          </div>

          {/* Tech & Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 text-base border-b border-slate-100 pb-3">Technologies & Settings</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Technologies Used</label>
              <input name="technologies" type="text" placeholder="AWS, React, Node.js, PostgreSQL" className={ic} />
              <p className="text-xs text-slate-400 mt-1">Comma-separated list.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
              <input name="sortOrder" type="number" defaultValue={0} min={0} className={ic} style={{ maxWidth: '120px' }} />
              <p className="text-xs text-slate-400 mt-1">Lower numbers appear first.</p>
            </div>

            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="published" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">Published (visible on site)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="featured" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">Featured (shown on home page)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Portfolio Item
            </button>
            <Link href="/admin/portfolio" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
