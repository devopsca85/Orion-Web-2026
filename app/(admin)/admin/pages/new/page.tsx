import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { createPage } from '@/lib/admin/page-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const ta = ic + ' resize-y'

const templates = [
  { value: 'default',    label: 'Default (medium width)' },
  { value: 'full-width', label: 'Full Width' },
  { value: 'narrow',     label: 'Narrow' },
  { value: 'landing',    label: 'Landing' },
]

const COMMON_PARENTS = ['home', 'about', 'services', 'products', 'careers', 'portfolio']

export default async function NewPageAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>
}) {
  const session = await auth()
  const { parent } = await searchParams
  const isSection = !!parent

  return (
    <>
      <AdminTopBar title={isSection ? 'New Page Section' : 'New Page'} user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link href="/admin/pages" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ChevronLeft size={16} /> Back to Pages
        </Link>

        <form action={createPage} className="space-y-6">

          {/* Page Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg border-b border-slate-100 pb-3">Page Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input id="title" name="title" type="text" required placeholder="Enter page title" className={ic} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Slug <span className="text-slate-400 text-xs font-normal">(auto-generated if empty)</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-sm">/</span>
                  <input id="slug" name="slug" type="text" placeholder="page-url-slug" className={ic} />
                </div>
                <script dangerouslySetInnerHTML={{ __html: `
                  (function(){
                    var t=document.getElementById('title'),s=document.getElementById('slug');
                    if(t&&s) t.addEventListener('blur',function(){
                      if(!s.value) s.value=t.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
                    });
                  })();
                `}} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Parent Page <span className="text-slate-400 text-xs font-normal">(leave blank for standalone)</span>
                </label>
                <input
                  name="parentSlug"
                  type="text"
                  defaultValue={parent ?? ''}
                  list="parent-suggestions"
                  placeholder="e.g. home, about"
                  className={ic}
                />
                <datalist id="parent-suggestions">
                  {COMMON_PARENTS.map(p => <option key={p} value={p} />)}
                </datalist>
                <p className="text-xs text-slate-400 mt-1">Set to assemble this as a section inside another page.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" defaultValue="DRAFT" className={ic}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                <select name="template" defaultValue="default" className={ic}>
                  {templates.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input name="sortOrder" type="number" defaultValue={0} min={0} className={ic} />
                <p className="text-xs text-slate-400 mt-1">Lower = renders first.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Excerpt <span className="text-slate-400 text-xs font-normal">(optional — used in meta description fallback)</span>
              </label>
              <textarea name="excerpt" rows={2} maxLength={500} placeholder="Short summary of this page" className={ta} />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
            <div>
              <h2 className="font-semibold text-slate-800 text-lg">Content <span className="text-red-500">*</span></h2>
              <p className="text-xs text-slate-400 mt-0.5">Use the <code>&lt;/&gt;</code> button to switch to raw HTML source mode for full custom designs.</p>
            </div>
            <RichTextEditor name="content" content="" placeholder="Write page content or paste full HTML…" minHeight="500px" defaultSourceMode />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 text-lg border-b border-slate-100 pb-3">SEO & Open Graph</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Meta Title <span className="text-slate-400 text-xs font-normal">(max 70 chars — defaults to page title)</span>
                </label>
                <input name="metaTitle" type="text" maxLength={70} placeholder="Overrides page title in search results" className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Canonical URL <span className="text-slate-400 text-xs font-normal">(optional)</span>
                </label>
                <input name="canonicalUrl" type="url" placeholder="https://example.com/page" className={ic} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Meta Description <span className="text-slate-400 text-xs font-normal">(max 160 chars — shown in search results)</span>
              </label>
              <textarea name="metaDesc" rows={2} maxLength={160} placeholder="Compelling description for search engines" className={ta + ' resize-none'} />
            </div>

            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  OG Title <span className="text-slate-400 text-xs font-normal">(Open Graph — for social sharing)</span>
                </label>
                <input name="ogTitle" type="text" maxLength={70} placeholder="Defaults to Meta Title" className={ic} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">OG Image URL</label>
                <input name="ogImage" type="url" placeholder="https://... (1200×630px recommended)" className={ic} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                OG Description <span className="text-slate-400 text-xs font-normal">(max 200 chars)</span>
              </label>
              <textarea name="ogDescription" rows={2} maxLength={200} placeholder="Defaults to Meta Description" className={ta + ' resize-none'} />
            </div>

            <div className="border-t border-slate-100 pt-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Structured Data <span className="text-slate-400 text-xs font-normal">(JSON-LD — optional)</span>
              </label>
              <textarea name="structuredData" rows={4} placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'} className={ta + ' font-mono text-xs'} />
            </div>

            <div className="flex items-center gap-2">
              <input name="noIndex" type="checkbox" id="noIndex" className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
              <label htmlFor="noIndex" className="text-sm font-medium text-slate-700">
                No Index <span className="text-slate-400 text-xs font-normal">(prevent search engines from indexing this page)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Page
            </button>
            <Link href="/admin/pages" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
