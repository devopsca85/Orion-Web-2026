import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { HeroImageInput } from '@/components/admin/HeroImageInput'
import { getSettings } from '@/lib/settings'
import { saveHomeSettings } from '@/lib/admin/settings-actions'
import { CheckCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ saved?: string }>
}

const inputClass = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const textareaClass = inputClass + ' resize-y'

export default async function HomeAdminPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  const settings = await getSettings([
    'home.hero.eyebrow',
    'home.hero.title',
    'home.hero.highlight',
    'home.hero.description',
    'home.hero.primaryCtaLabel',
    'home.hero.primaryCtaHref',
    'home.hero.secondaryCtaLabel',
    'home.hero.secondaryCtaHref',
    'home.hero.bullet1',
    'home.hero.bullet2',
    'home.hero.bullet3',
    'home.hero.backgroundImage',
    'home.hero.overlayOpacity',
  ])

  return (
    <>
      <AdminTopBar title="Home Page" user={session!.user} />
      <div className="p-6 max-w-3xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Home page settings saved successfully.
          </div>
        )}

        <form action={saveHomeSettings} className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">
              Hero Section
            </h2>

            {/* Background image + live preview */}
            <div className="pb-4 border-b border-slate-100">
              <HeroImageInput
                defaultUrl={settings['home.hero.backgroundImage'] || ''}
                defaultOpacity={settings['home.hero.overlayOpacity'] || '0.65'}
              />
            </div>

            <div>
              <label htmlFor="home.hero.eyebrow" className="block text-sm font-medium text-slate-700 mb-1">
                Eyebrow Label
              </label>
              <input
                id="home.hero.eyebrow"
                name="home.hero.eyebrow"
                type="text"
                defaultValue={settings['home.hero.eyebrow'] || ''}
                placeholder="Enterprise Technology Partner"
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">Small badge text above the headline.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="home.hero.title" className="block text-sm font-medium text-slate-700 mb-1">
                  Headline
                </label>
                <input
                  id="home.hero.title"
                  name="home.hero.title"
                  type="text"
                  defaultValue={settings['home.hero.title'] || ''}
                  placeholder="Transforming Business Through"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="home.hero.highlight" className="block text-sm font-medium text-slate-700 mb-1">
                  Highlighted Word
                </label>
                <input
                  id="home.hero.highlight"
                  name="home.hero.highlight"
                  type="text"
                  defaultValue={settings['home.hero.highlight'] || ''}
                  placeholder="Technology"
                  className={inputClass}
                />
                <p className="text-xs text-slate-400 mt-1">Shown in accent color after the headline.</p>
              </div>
            </div>

            <div>
              <label htmlFor="home.hero.description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="home.hero.description"
                name="home.hero.description"
                rows={3}
                defaultValue={settings['home.hero.description'] || ''}
                placeholder="Orion eSolutions delivers innovative software development..."
                className={textareaClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="home.hero.primaryCtaLabel" className="block text-sm font-medium text-slate-700 mb-1">
                  Primary Button Label
                </label>
                <input
                  id="home.hero.primaryCtaLabel"
                  name="home.hero.primaryCtaLabel"
                  type="text"
                  defaultValue={settings['home.hero.primaryCtaLabel'] || ''}
                  placeholder="Get a Free Consultation"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="home.hero.primaryCtaHref" className="block text-sm font-medium text-slate-700 mb-1">
                  Primary Button Link
                </label>
                <input
                  id="home.hero.primaryCtaHref"
                  name="home.hero.primaryCtaHref"
                  type="text"
                  defaultValue={settings['home.hero.primaryCtaHref'] || ''}
                  placeholder="/contact"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="home.hero.secondaryCtaLabel" className="block text-sm font-medium text-slate-700 mb-1">
                  Secondary Button Label
                </label>
                <input
                  id="home.hero.secondaryCtaLabel"
                  name="home.hero.secondaryCtaLabel"
                  type="text"
                  defaultValue={settings['home.hero.secondaryCtaLabel'] || ''}
                  placeholder="View Our Work"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="home.hero.secondaryCtaHref" className="block text-sm font-medium text-slate-700 mb-1">
                  Secondary Button Link
                </label>
                <input
                  id="home.hero.secondaryCtaHref"
                  name="home.hero.secondaryCtaHref"
                  type="text"
                  defaultValue={settings['home.hero.secondaryCtaHref'] || ''}
                  placeholder="/portfolio"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">Bullet Points (up to 3)</p>
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <input
                    key={n}
                    id={`home.hero.bullet${n}`}
                    name={`home.hero.bullet${n}`}
                    type="text"
                    defaultValue={settings[`home.hero.bullet${n}`] || ''}
                    placeholder={`Bullet point ${n}`}
                    className={inputClass}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">Leave empty to hide a bullet point.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Save Home Settings
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
