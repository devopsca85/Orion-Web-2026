import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/lib/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings([
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
  ])

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
      <Header branding={branding} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer branding={branding} />
    </>
  )
}
