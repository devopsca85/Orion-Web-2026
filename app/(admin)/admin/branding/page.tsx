import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { ColorPicker } from '@/components/admin/ColorPicker'
import { getSettings } from '@/lib/settings'
import { saveBrandingSettings } from '@/lib/admin/settings-actions'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ saved?: string }>
}

const inputClass =
  'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default async function BrandingAdminPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams

  const settings = await getSettings([
    'logo.url',
    'logo.alt',
    'brand.primaryColor',
    'brand.secondaryColor',
    'brand.companyName',
    'brand.tagline',
    'brand.footerCopyright',
    'contact.phone',
    'contact.email',
    'contact.address.street',
    'contact.address.city',
    'contact.address.state',
    'contact.address.zip',
    'social.linkedin',
    'social.twitter',
    'social.facebook',
    'social.youtube',
  ])

  const logoUrl = settings['logo.url'] || '/assets/images/logo.png'

  return (
    <>
      <AdminTopBar title="Branding &amp; Settings" user={session!.user} />
      <div className="p-6 max-w-4xl">
        {/* Success Banner */}
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} className="shrink-0" />
            Branding settings saved successfully.
          </div>
        )}

        <form action={saveBrandingSettings} className="space-y-6">
          {/* Logo Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Logo
            </h2>

            <div className="flex items-start gap-6">
              {/* Current logo preview */}
              <div className="shrink-0">
                <p className="text-xs text-slate-500 mb-2">Current Logo</p>
                <div className="h-16 w-40 flex items-center justify-center border border-slate-200 rounded-lg p-2 bg-white">
                  <Image
                    src={logoUrl}
                    alt={settings['logo.alt'] || 'Current logo'}
                    width={140}
                    height={48}
                    className="h-12 w-auto object-contain"
                    onError={undefined}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="logo.url" className="block text-sm font-medium text-slate-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    id="logo.url"
                    name="logo.url"
                    type="text"
                    defaultValue={settings['logo.url'] || ''}
                    placeholder="/assets/images/logo.png or https://..."
                    className={inputClass}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Use a relative path (e.g. <code>/assets/images/logo.png</code>) or an absolute URL.
                  </p>
                </div>

                <div>
                  <label htmlFor="logo.alt" className="block text-sm font-medium text-slate-700 mb-1">
                    Logo Alt Text
                  </label>
                  <input
                    id="logo.alt"
                    name="logo.alt"
                    type="text"
                    defaultValue={settings['logo.alt'] || ''}
                    placeholder="Orion Solutions"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Brand Colors
            </h2>

            <ColorPicker
              name="brand.primaryColor"
              label="Primary Color"
              defaultValue={settings['brand.primaryColor'] || '#1e3a8a'}
            />

            <ColorPicker
              name="brand.secondaryColor"
              label="Secondary Color"
              defaultValue={settings['brand.secondaryColor'] || '#f97316'}
            />

            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Color changes apply to CSS variables immediately after saving. For full Tailwind class
              propagation, rebuild the site after saving.
            </p>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Company Info
            </h2>

            <div>
              <label htmlFor="brand.companyName" className="block text-sm font-medium text-slate-700 mb-1">
                Company Name
              </label>
              <input
                id="brand.companyName"
                name="brand.companyName"
                type="text"
                defaultValue={settings['brand.companyName'] || ''}
                placeholder="Orion Solutions"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="brand.tagline" className="block text-sm font-medium text-slate-700 mb-1">
                Tagline
              </label>
              <input
                id="brand.tagline"
                name="brand.tagline"
                type="text"
                defaultValue={settings['brand.tagline'] || ''}
                placeholder="Transforming Business Through Technology"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="brand.footerCopyright"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Footer Copyright Text
              </label>
              <input
                id="brand.footerCopyright"
                name="brand.footerCopyright"
                type="text"
                defaultValue={settings['brand.footerCopyright'] || ''}
                placeholder="© 2026 Orion Solutions. All rights reserved."
                className={inputClass}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact.phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  id="contact.phone"
                  name="contact.phone"
                  type="tel"
                  defaultValue={settings['contact.phone'] || ''}
                  placeholder="+1 (800) 000-0000"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="contact.email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  id="contact.email"
                  name="contact.email"
                  type="email"
                  defaultValue={settings['contact.email'] || ''}
                  placeholder="support@orionesolutions.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact.address.street"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Street Address
              </label>
              <input
                id="contact.address.street"
                name="contact.address.street"
                type="text"
                defaultValue={settings['contact.address.street'] || ''}
                placeholder="100 Technology Drive"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="contact.address.city"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  City
                </label>
                <input
                  id="contact.address.city"
                  name="contact.address.city"
                  type="text"
                  defaultValue={settings['contact.address.city'] || ''}
                  placeholder="San Francisco"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact.address.state"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  State
                </label>
                <input
                  id="contact.address.state"
                  name="contact.address.state"
                  type="text"
                  defaultValue={settings['contact.address.state'] || ''}
                  placeholder="CA"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact.address.zip"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  ZIP Code
                </label>
                <input
                  id="contact.address.zip"
                  name="contact.address.zip"
                  type="text"
                  defaultValue={settings['contact.address.zip'] || ''}
                  placeholder="94105"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Social Media
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="social.linkedin" className="block text-sm font-medium text-slate-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  id="social.linkedin"
                  name="social.linkedin"
                  type="url"
                  defaultValue={settings['social.linkedin'] || ''}
                  placeholder="https://linkedin.com/company/..."
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="social.twitter" className="block text-sm font-medium text-slate-700 mb-1">
                  Twitter / X URL
                </label>
                <input
                  id="social.twitter"
                  name="social.twitter"
                  type="url"
                  defaultValue={settings['social.twitter'] || ''}
                  placeholder="https://twitter.com/..."
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="social.facebook" className="block text-sm font-medium text-slate-700 mb-1">
                  Facebook URL
                </label>
                <input
                  id="social.facebook"
                  name="social.facebook"
                  type="url"
                  defaultValue={settings['social.facebook'] || ''}
                  placeholder="https://facebook.com/..."
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="social.youtube" className="block text-sm font-medium text-slate-700 mb-1">
                  YouTube URL
                </label>
                <input
                  id="social.youtube"
                  name="social.youtube"
                  type="url"
                  defaultValue={settings['social.youtube'] || ''}
                  placeholder="https://youtube.com/@..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Save Branding Settings
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
