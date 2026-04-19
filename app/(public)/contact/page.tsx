import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';
import { generateMetadata as genMeta } from '@/lib/seo';
import { getSetting } from '@/lib/settings';

export const metadata: Metadata = genMeta({
  title: 'Contact Us',
  description:
    'Get in touch with Orion Solutions. Book a free consultation, ask about our services, or start a project conversation with our team.',
  path: '/contact',
  keywords: ['contact Orion Solutions', 'IT consulting inquiry', 'free consultation'],
});

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`,
  },
  {
    icon: MapPin,
    label: 'Office',
    value: `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.state}`,
    href: `https://maps.google.com/?q=${encodeURIComponent(SITE_CONFIG.address.street + ', ' + SITE_CONFIG.address.city)}`,
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon–Fri, 9:00 AM – 6:00 PM PT',
    href: undefined,
  },
];

export default async function ContactPage() {
  const calendlyUrl = await getSetting('contact.calendlyUrl', '');

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Contact', url: `${SITE_CONFIG.url}/contact` },
        ]}
      />

      <PageHero
        title="Let's Start a Conversation"
        description="Tell us about your technology challenge or goal — we will respond within one business day."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <Section className="bg-gray-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-soft">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Send Us a Message</h2>
                <p className="mb-6 text-gray-600">
                  Fill in the form and one of our team members will follow up within one business day.
                </p>
                <ContactForm calendlyUrl={calendlyUrl || undefined} />
              </div>
            </div>

            {/* Contact info + social proof */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                <h3 className="mb-5 font-bold text-gray-900">Contact Information</h3>
                <ul className="space-y-5">
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                        {href ? (
                          <a href={href} className="text-sm font-medium text-gray-900 hover:text-primary transition-colors" target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-primary p-6 text-white">
                <h3 className="mb-3 font-bold">What Happens Next?</h3>
                <ol className="space-y-4">
                  {[
                    'We review your message and assign the right expert for your needs.',
                    'You receive a personal response within one business day.',
                    'We schedule a free 30-minute discovery call at your convenience.',
                    'We prepare and share a tailored proposal — no commitment required.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-white/80">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                <p className="text-sm font-semibold text-gray-900">Trusted by enterprises worldwide</p>
                <div className="mt-3 flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-secondary fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-900">4.9/5</span>
                  <span className="text-sm text-gray-400">· 150+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
