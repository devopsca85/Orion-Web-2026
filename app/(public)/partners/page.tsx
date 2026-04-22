import type { Metadata } from 'next';
import { CheckCircle } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { partners, certifications } from '@/lib/data/partners';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Technology Partners & Certifications',
  description: 'Orion eSolutions is a certified partner of AWS, Microsoft Azure, Google Cloud, Salesforce, Snowflake, and more. Explore our technology partnerships and industry certifications.',
  path: '/partners',
  keywords: ['AWS partner', 'Microsoft partner', 'Google Cloud partner', 'technology partnerships', 'certifications'],
});

const tierLabel: Record<string, string> = { premier: 'Premier Partner', advanced: 'Advanced Partner', standard: 'Partner' };
const tierVariant: Record<string, 'secondary' | 'primary' | 'default'> = { premier: 'secondary', advanced: 'primary', standard: 'default' };
const categoryLabel: Record<string, string> = { cloud: 'Cloud', crm: 'CRM', erp: 'ERP', security: 'Security', data: 'Data & Analytics', devops: 'DevOps' };

export default function PartnersPage() {
  const premier = partners.filter((p) => p.tier === 'premier');
  const advanced = partners.filter((p) => p.tier === 'advanced');
  const standard = partners.filter((p) => p.tier === 'standard');

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Partners', url: `${SITE_CONFIG.url}/partners` },
      ]} />

      <PageHero
        title="Technology Partners & Certifications"
        description="We partner with the world's leading technology platforms and hold certifications that validate our expertise and commitment to quality."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Partners' }]}
      />

      {/* Premier Partners */}
      <Section className="bg-white">
        <Container>
          <SectionHeader eyebrow="Premier Partners" title="Our Highest-Tier Technology Partnerships" centered />
          <div className="grid gap-6 md:grid-cols-2">
            {premier.map((partner) => (
              <Card key={partner.slug} padding="lg" className="flex gap-6 items-start">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-2xl font-extrabold text-primary">{partner.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-gray-900">{partner.name}</h2>
                    <Badge variant={tierVariant[partner.tier]}>{tierLabel[partner.tier]}</Badge>
                    <Badge variant="default">{categoryLabel[partner.category]}</Badge>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-gray-600">{partner.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.competencies.map((c) => (
                      <span key={c} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-600">{c}</span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Advanced + Standard Partners */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader eyebrow="Technology Ecosystem" title="Advanced & Specialist Partners" centered />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...advanced, ...standard].map((partner) => (
              <Card key={partner.slug} hover padding="lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 border border-primary/10">
                    <span className="text-lg font-extrabold text-primary">{partner.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{partner.name}</p>
                    <Badge variant={tierVariant[partner.tier]} className="text-xs">{tierLabel[partner.tier]}</Badge>
                  </div>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">{partner.description}</p>
                <div className="flex flex-wrap gap-1">
                  {partner.competencies.slice(0, 3).map((c) => (
                    <span key={c} className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">{c}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Certifications */}
      <Section className="bg-white">
        <Container>
          <SectionHeader eyebrow="Quality & Security" title="Industry Certifications" description="Our certifications validate our commitment to security, quality, and delivery excellence." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <Card key={cert.name} padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-lg font-extrabold">
                  {cert.name.split(' ')[0]}
                </div>
                <h3 className="mb-1 font-bold text-gray-900">{cert.name}</h3>
                <p className="mb-2 text-sm text-gray-600">{cert.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Certified since {cert.year}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Partner With a Certified Team"
        description="Our partner certifications translate directly to faster delivery, lower risk, and better outcomes for your technology initiatives."
        primaryCta={{ label: 'Start a Project', href: '/contact' }}
        secondaryCta={{ label: 'View Our Services', href: '/services' }}
      />
    </>
  );
}
