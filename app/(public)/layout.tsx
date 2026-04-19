import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/lib/settings'
import { getNavLinks } from '@/lib/navigation'
import { TrackPageView } from '@/components/analytics/TrackPageView'
import { prisma } from '@/lib/prisma'

function safeColor(val: string | undefined, fallback: string): string {
  return /^#[0-9a-fA-F]{3,8}$/.test((val ?? '').trim()) ? val!.trim() : fallback
}

function hexToRgbChannels(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

async function getFooterData() {
  try {
    const [offices, links] = await Promise.all([
      prisma.countryOffice.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { country: 'asc' }],
      }),
      prisma.footerLink.findMany({
        where: { active: true },
        orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }],
      }),
    ])
    return { offices, links }
  } catch {
    return { offices: [], links: [] }
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, navLinks, footerData] = await Promise.all([
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
      'brand.navColor',
      'brand.navBgColor',
      'brand.footerBgColor',
    ]),
    getNavLinks(),
    getFooterData(),
  ])

  const primaryColor   = safeColor(settings['brand.primaryColor'],   '#1e3a8a')
  const secondaryColor = safeColor(settings['brand.secondaryColor'],  '#f97316')
  const navColor       = safeColor(settings['brand.navColor'],        '#ffffff')
  const navBgColor     = safeColor(settings['brand.navBgColor'],      '#1e3a8a')
  const footerBgColor  = safeColor(settings['brand.footerBgColor'],   '#1e293b')

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
      {/* Inject brand colors — hex + RGB channels so Tailwind opacity modifiers work */}
      <style>{`:root{--brand-primary:${primaryColor};--brand-primary-rgb:${hexToRgbChannels(primaryColor)};--brand-secondary:${secondaryColor};--brand-secondary-rgb:${hexToRgbChannels(secondaryColor)};--brand-nav:${navColor};--brand-nav-rgb:${hexToRgbChannels(navColor)};--brand-nav-bg:${navBgColor};--brand-nav-bg-rgb:${hexToRgbChannels(navBgColor)};--brand-footer-bg:${footerBgColor}}`}</style>
      <TrackPageView />
      <Header branding={branding} navLinks={navLinks} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer branding={branding} offices={footerData.offices} links={footerData.links} />
    </>
  )
}
