import Link from 'next/link';
import { LogoImg } from '@/components/ui/LogoImg';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { SITE_CONFIG } from '@/lib/constants';
import { getPageSections } from '@/lib/page-sections';

interface BrandingData {
  logoUrl: string
  logoAlt: string
  phone: string
  email: string
  address: { street: string; city: string; state: string; zip: string }
  social: { linkedin: string; twitter: string; facebook: string; instagram: string }
  companyName: string
  footerCopyright: string
}

interface OfficeData {
  id: string
  country: string
  flag: string | null
  address: string | null
  phone: string | null
  email: string | null
}

interface LinkData {
  id: string
  label: string
  href: string
  group: string
  openInNew: boolean
}

interface FooterProps {
  branding?: BrandingData
  offices?: OfficeData[]
  links?: LinkData[]
}

export async function Footer({ branding, offices = [], links = [] }: FooterProps) {
  const sections = await getPageSections('footer')
  const visibleKeys = new Set(sections.filter((s) => s.visible).map((s) => s.key))
  const show = (key: string) => visibleKeys.has(key)

  const currentYear = new Date().getFullYear();

  const logoSrc = branding?.logoUrl || '/assets/images/logo.png';
  const logoAlt = branding?.logoAlt || 'Orion Solutions';
  const phone = branding?.phone || SITE_CONFIG.phone;
  const email = branding?.email || SITE_CONFIG.email;
  const address = {
    street: branding?.address?.street || SITE_CONFIG.address.street,
    city: branding?.address?.city || SITE_CONFIG.address.city,
    state: branding?.address?.state || SITE_CONFIG.address.state,
    zip: branding?.address?.zip || SITE_CONFIG.address.zip,
  };
  const social = {
    linkedin: branding?.social?.linkedin || SITE_CONFIG.social.linkedin,
    twitter: branding?.social?.twitter || SITE_CONFIG.social.twitter,
    facebook: branding?.social?.facebook || SITE_CONFIG.social.facebook,
    instagram: branding?.social?.instagram || SITE_CONFIG.social.instagram,
  };
  const footerCopyright = branding?.footerCopyright || '';

  const linkGroups = links.reduce<Record<string, LinkData[]>>((acc, link) => {
    if (!acc[link.group]) acc[link.group] = [];
    acc[link.group].push(link);
    return acc;
  }, {});

  const hasDbLinks = links.length > 0;
  const legalLinks = links.filter((l) => l.group.toLowerCase() === 'legal');

  return (
    <footer className="text-gray-300" style={{ backgroundColor: 'var(--brand-footer-bg)' }}>
      {/* Country offices strip */}
      {show('countries') && offices.length > 0 && (
        <div className="border-b border-white/10">
          <Container>
            <div className="py-10">
              <h3 className="text-base font-bold text-white mb-6">
                Countries
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {offices.map((office) => (
                  <div
                    key={office.id}
                    className="rounded-xl bg-white/10 border border-white/10 p-4 space-y-1.5"
                  >
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      {office.flag && <span>{office.flag}</span>}
                      {office.country}
                    </p>
                    {office.address && (
                      <p className="text-xs text-gray-400 leading-relaxed">{office.address}</p>
                    )}
                    {office.phone && (
                      <a
                        href={`tel:${office.phone.replace(/\D/g, '')}`}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        {office.phone}
                      </a>
                    )}
                    {office.email && (
                      <a
                        href={`mailto:${office.email}`}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        {office.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Main footer body */}
      {(show('links') || show('newsletter')) && (
        <Container>
          <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:py-20">
            {/* Brand column — always shown with main body */}
            <div className="lg:col-span-1">
              <Link href="/" className="mb-6 flex items-center gap-2" aria-label="Orion Solutions Home">
                <LogoImg
                  src={logoSrc}
                  alt={logoAlt}
                  width={140}
                  height={36}
                  className="h-9 w-auto"
                />
                <span className="text-lg font-bold text-white hidden" id="footer-logo-fallback">
                  Orion <span className="text-secondary">eSolutions</span>
                </span>
              </Link>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                Transforming businesses through innovative technology solutions. Trusted by 150+ enterprises worldwide.
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 transition-colors hover:text-white">
                    <Mail className="h-4 w-4 text-secondary flex-shrink-0" />
                    {email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 text-secondary flex-shrink-0" />
                    {phone}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span>
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.zip}
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex gap-3">
                {[
                  { href: social.linkedin, icon: Linkedin, label: 'LinkedIn' },
                  { href: social.twitter, icon: Twitter, label: 'Twitter' },
                  { href: social.facebook, icon: Facebook, label: 'Facebook' },
                  { href: social.instagram, icon: Instagram, label: 'Instagram' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-primary hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {show('links') && (hasDbLinks ? (
              Object.entries(linkGroups)
                .filter(([group]) => group.toLowerCase() !== 'legal')
                .slice(0, 3)
                .map(([group, groupLinks]) => (
                  <div key={group}>
                    <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
                      {group}
                    </h3>
                    <ul className="space-y-3">
                      {groupLinks.map((link) => (
                        <li key={link.id}>
                          <Link
                            href={link.href}
                            target={link.openInNew ? '_blank' : undefined}
                            rel={link.openInNew ? 'noopener noreferrer' : undefined}
                            className="text-sm transition-colors hover:text-white hover:underline"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
            ) : (
              <>
                <div>
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Services</h3>
                  <ul className="space-y-3">
                    {[
                      { label: 'Software Development', href: '/services/software-development' },
                      { label: 'Cloud Solutions', href: '/services/cloud-solutions' },
                      { label: 'IT Consulting', href: '/services/it-consulting' },
                      { label: 'Digital Transformation', href: '/services/digital-transformation' },
                      { label: 'Cybersecurity', href: '/services/cybersecurity' },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm transition-colors hover:text-white hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Industries</h3>
                  <ul className="space-y-3">
                    {[
                      { label: 'Healthcare', href: '/industries/healthcare' },
                      { label: 'Finance', href: '/industries/finance' },
                      { label: 'Retail', href: '/industries/retail' },
                      { label: 'Manufacturing', href: '/industries/manufacturing' },
                      { label: 'Education', href: '/industries/education' },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm transition-colors hover:text-white hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Company</h3>
                  <ul className="space-y-3">
                    {[
                      { label: 'About Us', href: '/about' },
                      { label: 'Case Studies', href: '/portfolio' },
                      { label: 'Blog', href: '/blog' },
                      { label: 'Careers', href: '/careers' },
                      { label: 'Contact', href: '/contact' },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm transition-colors hover:text-white hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ))}

            {/* Newsletter */}
            {show('newsletter') && (
              <div>
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
                  Stay Updated
                </h3>
                <p className="mb-4 text-sm text-gray-400">
                  Subscribe to our newsletter for the latest insights on technology and digital transformation.
                </p>
                <NewsletterForm />
              </div>
            )}
          </div>
        </Container>
      )}

      {/* Bottom bar */}
      {show('bottombar') && (
        <div className="border-t border-white/10">
          <Container>
            <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-gray-500 sm:flex-row">
              <p>
                {footerCopyright
                  ? footerCopyright
                  : `© ${currentYear} ${SITE_CONFIG.name}. All rights reserved.`}
              </p>
              <div className="flex gap-6">
                {legalLinks.length > 0 ? (
                  legalLinks.map((link) => (
                    <Link key={link.id} href={link.href} className="transition-colors hover:text-gray-300">
                      {link.label}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link href="/privacy-policy" className="transition-colors hover:text-gray-300">Privacy Policy</Link>
                    <Link href="/terms-of-service" className="transition-colors hover:text-gray-300">Terms of Service</Link>
                    <Link href="/cookie-policy" className="transition-colors hover:text-gray-300">Cookie Policy</Link>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </footer>
  );
}
