import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { getEmailSettings, saveEmailSettings, testEmailSettings } from '@/lib/admin/email-settings-actions'
import { CheckCircle, AlertCircle, Mail, Zap, Send, ShieldCheck, FlaskConical } from 'lucide-react'

interface Props { searchParams: Promise<{ saved?: string; tested?: string; error?: string; 'tested-to'?: string }> }

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
            <CheckCircle size={16} /> Test email sent successfully — check your inbox.
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
            <AlertCircle size={16} /> {
              error === 'send-failed' ? `Failed to send test email. Check your ${provider === 'brevo' ? 'Brevo' : 'Resend'} API key and From Email address.`
              : error === 'no-key' ? `No ${provider === 'brevo' ? 'Brevo' : 'Resend'} API key saved. Save your settings first.`
              : error === 'no-email' ? 'Enter a recipient email address to test.'
              : 'Something went wrong.'
            }
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
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <input type="checkbox" name="recaptcha.disabled" id="recaptcha_disabled" value="true" defaultChecked={s['recaptcha.disabled'] === 'true'} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="recaptcha_disabled" className="text-sm text-slate-700">
                <span className="font-medium">Disable reCAPTCHA</span>
                <span className="text-slate-400 ml-1">— forms work without verification (honeypot + rate-limit still active)</span>
              </label>
            </div>
            <p className="text-xs text-slate-400">When enabled, enter both keys and make sure your domain is registered at <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">google.com/recaptcha/admin</a>.</p>
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

        {/* Test email connection */}
        <form action={testEmailSettings} className="bg-white rounded-xl border border-slate-200">
          <div className="p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <FlaskConical size={16} /> Test Email Connection
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Send a test email using your saved <span className="font-medium capitalize">{provider === 'brevo' ? 'Brevo' : provider === 'smtp' ? 'SMTP' : 'Resend'}</span> settings to verify the connection is working.
            </p>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Send test to</label>
                <input
                  name="test_to"
                  type="email"
                  defaultValue={s['email.contact_to'] || ''}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                <Send size={14} /> Send Test Email
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Make sure you&apos;ve <strong>saved your settings</strong> before testing. The test uses the API key and From Email currently saved in the database.
            </p>
          </div>
        </form>
      </div>
    </>
  )
}
