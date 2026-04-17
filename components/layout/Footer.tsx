import Link from 'next/link';
import { LogoImg } from '@/components/ui/LogoImg';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { SITE_CONFIG, FOOTER_LINKS } from '@/lib/constants';

interface BrandingData {
  logoUrl: string
  logoAlt: string
  phone: string
  email: string
  address: { street: string; city: string; state: string; zip: string }
  social: { linkedin: string; twitter: string; facebook: string; youtube: string }
  companyName: string
  footerCopyright: string
}

interface FooterProps {
  branding?: BrandingData
}

export function Footer({ branding }: FooterProps = {}) {
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
    youtube: branding?.social?.youtube || SITE_CONFIG.social.youtube,
  };
  const footerCopyright = branding?.footerCopyright || '';

  return (
    <footer className="bg-orion-slate text-gray-300">
      {/* Main footer */}
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:py-20">
          {/* Brand column */}
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
            {/* Contact info */}
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

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {[
                { href: social.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: social.twitter, icon: Twitter, label: 'Twitter' },
                { href: social.facebook, icon: Facebook, label: 'Facebook' },
                { href: social.youtube, icon: Youtube, label: 'YouTube' },
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

          {/* Services */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Industries
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.industries.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Stay Updated
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Subscribe to our newsletter for the latest insights on technology and digital transformation.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-gray-500 sm:flex-row">
            <p>
              {footerCopyright
                ? footerCopyright
                : `© ${currentYear} ${SITE_CONFIG.name}. All rights reserved.`}
            </p>
            <div className="flex gap-6">
              {FOOTER_LINKS.legal.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-gray-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
