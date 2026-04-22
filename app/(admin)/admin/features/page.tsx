import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { prisma } from '@/lib/prisma'
import { saveFeatures, addFeature, deleteFeature } from '@/lib/admin/feature-actions'
import { Plus, Trash2, Info } from 'lucide-react'

const ic = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const ta = ic + ' resize-y'

const ICONS = [
  'TrendingUp','Users','Shield','Clock','Zap','CheckCircle',
  'Star','Lightbulb','Globe','Code2','BarChart2','Lock',
  'Rocket','Heart','Award','Target',
]

const DEFAULT_FEATURES = [
  { title: 'Proven Delivery Track Record', description: '500+ projects delivered across 18 countries with a 98% client satisfaction rating.', icon: 'TrendingUp', panel: 'left' },
  { title: 'Senior-Level Talent', description: 'Every engagement is staffed with senior engineers and consultants who have 10+ years of industry experience.', icon: 'Users', panel: 'left' },
  { title: 'Security-First Approach', description: 'Security is built into every layer — from architecture reviews and code scanning to penetration testing.', icon: 'Shield', panel: 'left' },
  { title: 'Agile and Transparent', description: 'Two-week sprints with regular demos and clear reporting. You always know what is being built.', icon: 'Clock', panel: 'left' },
  { title: 'Accelerated Time to Market', description: 'Pre-built accelerators and established CI/CD practices help our clients ship 3× faster.', icon: 'Zap', panel: 'right' },
  { title: 'Post-Launch Partnership', description: 'We do not disappear after go-live. Flexible support and managed services plans keep you secure.', icon: 'CheckCircle', panel: 'right' },
]

export default async function FeaturesAdminPage() {
  const session = await auth()
  const features = await prisma.siteFeature.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <>
      <AdminTopBar title="Why Us — Features" user={session!.user} />
      <div className="p-6 max-w-4xl space-y-6">

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-2 text-sm text-blue-700">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>First 4 features appear on the left column. Items with panel <strong>right</strong> appear in the blue commitment box on the right.</span>
        </div>

        {/* Seed defaults if empty */}
        {features.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <p className="text-slate-500 text-sm mb-4">No features yet. Seed with the defaults from the static component?</p>
            <form action={async () => {
              'use server'
              const { auth: a } = await import('@/lib/auth')
              const session = await a(); if (!session) return
              const { prisma: db } = await import('@/lib/prisma')
              const { revalidatePath } = await import('next/cache')
              await db.siteFeature.createMany({ data: DEFAULT_FEATURES.map((f, i) => ({ ...f, sortOrder: i, active: true })) })
              revalidatePath('/admin/features'); revalidatePath('/')
            }}>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Seed Defaults</button>
            </form>
          </div>
        )}

        {features.length > 0 && (
          <form action={saveFeatures} className="space-y-4">
            {features.map((f, i) => (
              <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feature {i + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" name="active" value={String(f.id)} defaultChecked={f.active} className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                      Active
                    </label>
                    <form action={deleteFeature.bind(null, f.id)}>
                      <button type="submit" className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </div>
                <input type="hidden" name="id" value={f.id} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                    <input name="title" type="text" required defaultValue={f.title} className={ic} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Icon</label>
                      <select name="icon" defaultValue={f.icon} className={ic}>
                        {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Panel</label>
                      <select name="panel" defaultValue={f.panel} className={ic}>
                        <option value="left">Left</option>
                        <option value="right">Right (blue box)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                    <textarea name="description" rows={2} required defaultValue={f.description} className={ta} />
                  </div>
                </div>
              </div>
            ))}
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Save All Features
            </button>
          </form>
        )}

        {/* Add new feature */}
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Plus size={15} /> Add Feature</h3>
          <form action={addFeature} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                <input name="title" type="text" required placeholder="Feature name" className={ic} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Icon</label>
                  <select name="icon" className={ic}>
                    {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Panel</label>
                  <select name="panel" className={ic}>
                    <option value="left">Left</option>
                    <option value="right">Right (blue box)</option>
                  </select>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <textarea name="description" rows={2} required placeholder="What this means for clients" className={ta} />
              </div>
            </div>
            <button type="submit" className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={14} /> Add
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
