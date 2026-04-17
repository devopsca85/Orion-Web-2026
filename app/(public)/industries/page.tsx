import type { Metadata } from 'next';
import Link from 'next/link';
import { Landmark, HeartPulse, ShoppingCart, Factory, Building2, GraduationCap, Wifi, Zap, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card, CardIcon } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { industries } from '@/lib/data/industries';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Industries We Serve',
  description: 'Orion Solutions delivers tailored technology solutions across financial services, healthcare, retail, manufacturing, government, education, telecom, and energy sectors.',
  path: '/industries',
  keywords: ['industry solutions', 'vertical expertise', 'sector technology'],
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, HeartPulse, ShoppingCart, Factory, Building2, GraduationCap, Wifi, Zap,
};

export default function IndustriesPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Industries', url: `${SITE_CONFIG.url}/industries` },
      ]} />

      <PageHero
        title="Industries We Serve"
        description="Deep domain expertise across eight major industries. We speak your language, understand your regulations, and know the technology patterns that work in your sector."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Industries' }]}
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Vertical Expertise"
            title="Technology Built for Your Industry"
            description="Generic technology solutions rarely solve industry-specific problems. Our practice leads have spent careers in the sectors they serve."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => {
              const Icon = iconMap[industry.icon] || Landmark;
              return (
                <Link key={industry.slug} href={`/industries/${industry.slug}`} className="group block">
                  <Card hover padding="lg" className="h-full">
                    <CardIcon
                      icon={<Icon className="h-6 w-6" />}
                      className="group-hover:bg-primary group-hover:text-white transition-colors"
                    />
                    <h2 className="mb-2 font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {industry.title}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600">
                      {industry.shortDescription}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Cross-industry capabilities */}
      <Section className="bg-gray-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">Cross-Industry</p>
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Domain Knowledge Meets Technical Depth</h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                Each of our industry practices is led by consultants who have worked inside the organizations they now serve. They understand the regulatory environment, the competitive dynamics, and the technology patterns that actually work — not just in theory, but in production.
              </p>
              <ul className="space-y-3">
                {[
                  'Industry-specific compliance expertise built into every engagement',
                  'Pre-built accelerators tuned for sector-specific use cases',
                  'Access to peer networks and industry benchmarks',
                  'Regulatory advisory alongside technical delivery',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-gray-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {industries.slice(0, 4).map((industry) => {
                const Icon = iconMap[industry.icon] || Landmark;
                return (
                  <div key={industry.slug} className="rounded-xl bg-white border border-gray-100 p-5 shadow-soft">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-sm text-gray-900">{industry.title}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {industry.stats.slice(0, 2).map((stat) => (
                        <div key={stat.label}>
                          <p className="text-base font-extrabold text-primary">{stat.value}</p>
                          <p className="text-xs text-gray-400 leading-tight">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      <CTA
        title="Don't See Your Industry?"
        description="We work across many more sectors. Contact us to discuss your specific industry context and how we can help."
        primaryCta={{ label: 'Talk to an Industry Expert', href: '/contact' }}
      />
    </>
  );
}
