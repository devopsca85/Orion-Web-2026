import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/lib/settings'
import { getNavLinks } from '@/lib/navigation'
import { TrackPageView } from '@/components/analytics/TrackPageView'

function safeColor(val: string | undefined, fallback: string): string {
  return /^#[0-9a-fA-F]{3,8}$/.test((val ?? '').trim()) ? val!.trim() : fallback
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, navLinks] = await Promise.all([
    getSettings([
      'logo.url',
      'logo.alt',
      'contact.phone',
      'contact.email',
      'contact.address.street',
      'contact.address.city',
      'contact.address.state',
      'contact.address.zip',
      'social.linkedin',
      'social.twitter',
      'social.facebook',
      'social.instagram',
      'brand.companyName',
      'brand.tagline',
      'brand.footerCopyright',
      'brand.primaryColor',
      'brand.secondaryColor',
    ]),
    getNavLinks(),
  ])

  const primaryColor   = safeColor(settings['brand.primaryColor'],   '#1e3a8a')
  const secondaryColor = safeColor(settings['brand.secondaryColor'],  '#f97316')

  const branding = {
    logoUrl: settings['logo.url'] || '',
    logoAlt: settings['logo.alt'] || 'Orion Solutions',
    phone: settings['contact.phone'] || '',
    email: settings['contact.email'] || '',
    address: {
      street: settings['contact.address.street'] || '',
      city: settings['contact.address.city'] || '',
      state: settings['contact.address.state'] || '',
      zip: settings['contact.address.zip'] || '',
    },
    social: {
      linkedin: settings['social.linkedin'] || '',
      twitter: settings['social.twitter'] || '',
      facebook: settings['social.facebook'] || '',
      instagram: settings['social.instagram'] || '',
    },
    companyName: settings['brand.companyName'] || '',
    tagline: settings['brand.tagline'] || '',
    footerCopyright: settings['brand.footerCopyright'] || '',
  }

  return (
    <>
      {/* Inject brand colors as CSS variables — updated on save, no rebuild needed */}
      <style>{`:root{--brand-primary:${primaryColor};--brand-secondary:${secondaryColor}}`}</style>
      <TrackPageView />
      <Header branding={branding} navLinks={navLinks} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer branding={branding} />
    </>
  )
}
