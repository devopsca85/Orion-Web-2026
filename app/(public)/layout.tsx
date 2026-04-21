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
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

function buildGoogleFontsUrl(fonts: string[]): string | null {
  const unique = [...new Set(fonts.filter(Boolean).filter(f => f !== 'Inter'))]
  if (unique.length === 0) return null
  const params = unique.map(f => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400`).join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

function buildFontFamily(name: string): string {
  if (!name) return ''
  return `'${name}', system-ui, sans-serif`
}

function sectionPaddingToCss(val: string): string {
  const map: Record<string, string> = { sm: '3rem', md: '5rem', lg: '7rem', xl: '9rem' }
  return map[val] || '5rem'
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
      'brand.headingColor',
      'brand.bodyTextColor',
      'brand.linkColor',
      'css.fontHeading',
      'css.fontBody',
      'css.fontHeadingWeight',
      'css.borderRadius',
      'css.containerMaxWidth',
      'css.sectionPadding',
      'css.custom',
    ]),
    getNavLinks(),
    getFooterData(),
  ])

  const primaryColor   = safeColor(settings['brand.primaryColor'],   '#1e3a8a')
  const secondaryColor = safeColor(settings['brand.secondaryColor'],  '#f97316')
  const navColor       = safeColor(settings['brand.navColor'],        '#ffffff')
  const navBgColor     = safeColor(settings['brand.navBgColor'],      '#1e3a8a')
  const footerBgColor  = safeColor(settings['brand.footerBgColor'],   '#1e293b')

  const headingColorVal  = safeColor(settings['brand.headingColor'],  '')
  const bodyTextColorVal = safeColor(settings['brand.bodyTextColor'], '#111827')
  const linkColorVal     = safeColor(settings['brand.linkColor'],     '')
  const fontHeadingName  = settings['css.fontHeading']       || ''
  const fontBodyName     = settings['css.fontBody']          || ''
  const fontHeadingWeight = settings['css.fontHeadingWeight'] || '700'
  const borderRadius      = settings['css.borderRadius']     || '8px'
  const containerMaxWidth = settings['css.containerMaxWidth']|| '1280px'
  const sectionPadVal     = settings['css.sectionPadding']   || 'md'
  const customCssValue    = settings['css.custom']           || ''

  const fontHeadingFamily = buildFontFamily(fontHeadingName)
  const fontBodyFamily    = buildFontFamily(fontBodyName)
  const sectionPaddingValue = sectionPaddingToCss(sectionPadVal)
  const googleFontsUrl    = buildGoogleFontsUrl([fontBodyName, fontHeadingName])
  const headingColor      = headingColorVal  || 'inherit'
  const bodyTextColor     = bodyTextColorVal || '#111827'
  const linkColor         = linkColorVal     || 'inherit'

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
      {/* Inject design system CSS vars */}
      <style suppressHydrationWarning>{`
        :root {
          --brand-primary: ${primaryColor};
          --brand-primary-rgb: ${hexToRgbChannels(primaryColor)};
          --brand-secondary: ${secondaryColor};
          --brand-secondary-rgb: ${hexToRgbChannels(secondaryColor)};
          --brand-nav: ${navColor};
          --brand-nav-rgb: ${hexToRgbChannels(navColor)};
          --brand-nav-bg: ${navBgColor};
          --brand-nav-bg-rgb: ${hexToRgbChannels(navBgColor)};
          --brand-footer-bg: ${footerBgColor};
          --brand-heading-color: ${headingColor};
          --brand-body-text: ${bodyTextColor};
          --brand-link: ${linkColor};
          --font-heading: ${fontHeadingFamily};
          --font-body-custom: ${fontBodyFamily};
          --font-heading-weight: ${fontHeadingWeight};
          --border-radius-base: ${borderRadius};
          --container-max-width: ${containerMaxWidth};
          --section-padding: ${sectionPaddingValue};
        }
        body { font-family: var(--font-body-custom, var(--font-inter, system-ui)); color: var(--brand-body-text, #111827); }
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-heading, var(--font-body-custom, var(--font-inter, system-ui)));
          font-weight: var(--font-heading-weight, 700);
          color: var(--brand-heading-color, inherit);
        }
        a { color: var(--brand-link, inherit); }
        .rounded { border-radius: var(--border-radius-base) !important; }
        .rounded-md { border-radius: calc(var(--border-radius-base) * 1.5) !important; }
        .rounded-lg { border-radius: calc(var(--border-radius-base) * 2) !important; }
        .rounded-xl { border-radius: calc(var(--border-radius-base) * 2.5) !important; }
        .rounded-2xl { border-radius: calc(var(--border-radius-base) * 3) !important; }
      `}</style>
      {/* Custom CSS from admin */}
      {customCssValue && <style suppressHydrationWarning>{customCssValue}</style>}
      {/* Google Fonts */}
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      <TrackPageView />
      <Header branding={branding} navLinks={navLinks} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer branding={branding} offices={footerData.offices} links={footerData.links} />
    </>
  )
}
