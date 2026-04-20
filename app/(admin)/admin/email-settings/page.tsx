import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { getEmailSettings, saveEmailSettings } from '@/lib/admin/email-settings-actions'
import { CheckCircle, AlertCircle, Mail, Zap, Send, ShieldCheck } from 'lucide-react'

interface Props { searchParams: Promise<{ saved?: string; tested?: string; error?: string }> }

export default async function EmailSettingsPage({ searchParams }: Props) {
  const session = await auth()
  const { saved, tested, error } = await searchParams
  const s = await getEmailSettings()

  const provider = s['email.provider'] || 'resend'

  return (
    <>
      <AdminTopBar title="Email Settings" user={session!.user} />
      <div className="p-6 max-w-3xl space-y-6">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
            <CheckCircle size={16} /> Settings saved.
          </div>
        )}
        {tested === '1' && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm font-medium">
            <Mail size={16} /> Test email sent successfully.
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
            <AlertCircle size={16} /> {error === 'send-failed' ? 'Failed to send test email. Check your API key.' : error === 'no-key' ? 'API key is required.' : 'Test email address is required.'}
          </div>
        )}

        <form action={saveEmailSettings} className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {/* Provider */}
          <div className="p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Email Provider</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['resend', 'brevo', 'smtp'] as const).map((p) => (
                <label key={p} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${provider === p ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="email.provider" value={p} defaultChecked={provider === p} className="text-indigo-600 focus:ring-indigo-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 capitalize">{p === 'smtp' ? 'SMTP' : p.charAt(0).toUpperCase() + p.slice(1)}</p>
                    <p className="text-xs text-slate-400">{p === 'resend' ? 'resend.com' : p === 'brevo' ? 'brevo.com' : 'Custom SMTP'}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* General */}
          <div className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2"><Mail size={16} /> Sender Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">From Name</label>
                <input name="email.from_name" defaultValue={s['email.from_name'] || 'Orion eSolutions'} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">From Email</label>
                <input name="email.from_email" type="email" defaultValue={s['email.from_email'] || ''} placeholder="noreply@orionesolutions.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Notification Email</label>
                <input name="email.contact_to" type="email" defaultValue={s['email.contact_to'] || ''} placeholder="support@orionesolutions.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <p className="text-xs text-slate-400 mt-1">Where contact form submissions are delivered.</p>
              </div>
            </div>
          </div>

          {/* Resend */}
          <div className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2"><Zap size={16} /> Resend</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
              <input name="email.resend_api_key" type="password" defaultValue={s['email.resend_api_key'] || ''} placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {/* Brevo */}
          <div className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2"><Send size={16} /> Brevo (Sendinblue)</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                <input name="email.brevo_api_key" type="password" defaultValue={s['email.brevo_api_key'] || ''} placeholder="xkeysib-xxxxxxxxxxxxxxxx" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Newsletter List ID</label>
                <input name="email.brevo_list_id" type="number" defaultValue={s['email.brevo_list_id'] || ''} placeholder="1" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          {/* SMTP */}
          <div className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-800">SMTP</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Host</label>
                <input name="email.smtp_host" defaultValue={s['email.smtp_host'] || ''} placeholder="smtp.example.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Port</label>
                <input name="email.smtp_port" defaultValue={s['email.smtp_port'] || '587'} placeholder="587" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input name="email.smtp_user" defaultValue={s['email.smtp_user'] || ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input name="email.smtp_pass" type="password" defaultValue={s['email.smtp_pass'] || ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input type="checkbox" name="email.smtp_secure" id="smtp_secure" defaultChecked={s['email.smtp_secure'] === 'true'} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="smtp_secure" className="text-sm text-slate-700">Use TLS (port 465)</label>
              </div>
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2"><ShieldCheck size={16} /> reCAPTCHA v3</h2>
              <a href="https://www.google.com/recaptcha/admin/create" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">Get keys →</a>
            </div>
            <p className="text-xs text-slate-400">Protects contact forms from spam bots. Leave blank to disable — honeypot and rate-limiting still apply.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Site Key <span className="text-slate-400 font-normal">(public)</span></label>
                <input name="recaptcha.site_key" defaultValue={s['recaptcha.site_key'] || ''} placeholder="6Lc…" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key <span className="text-slate-400 font-normal">(private)</span></label>
                <input name="recaptcha.secret_key" type="password" defaultValue={s['recaptcha.secret_key'] || ''} placeholder="6Lc…" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">Save Settings</button>
          </div>
        </form>
      </div>
    </>
  )
}
