import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { getSettings } from '@/lib/settings'
import { saveContactSettings } from '@/lib/admin/settings-actions'
import { CheckCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ saved?: string }>
}

const inputClass =
  'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function ContactSettingsPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams
  const settings = await getSettings(['contact.calendlyUrl'])

  return (
    <>
      <AdminTopBar title="Contact Settings" user={session!.user} />
      <div className="p-6 max-w-2xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Contact settings saved.
          </div>
        )}

        <form action={saveContactSettings} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Calendly Integration
            </h2>

            <div>
              <label htmlFor="contact.calendlyUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Calendly URL
              </label>
              <input
                id="contact.calendlyUrl"
                name="contact.calendlyUrl"
                type="url"
                defaultValue={settings['contact.calendlyUrl'] || ''}
                placeholder="https://calendly.com/your-name/30min"
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">
                When set, visitors will be redirected to this URL after submitting the contact form.
                Leave empty to show the standard success message instead.
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
