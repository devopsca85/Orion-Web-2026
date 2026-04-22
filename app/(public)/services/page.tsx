import type { Metadata } from 'next';
import Link from 'next/link';
import { Code2, Cloud, Lightbulb, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section } from '@/components/ui/Container';
import { Card, CardIcon } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { services } from '@/lib/data/services';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Services',
  description:
    'Comprehensive technology services from Orion eSolutions: software development, cloud solutions, IT consulting, digital transformation, cybersecurity, and data analytics.',
  path: '/services',
  keywords: ['IT services', 'technology services', 'managed services'],
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Cloud, Lightbulb, Zap, Shield, BarChart3,
};

const processSteps = [
  { step: '01', title: 'Discovery', description: 'We invest time upfront to understand your business, goals, constraints, and current technology landscape before proposing solutions.' },
  { step: '02', title: 'Strategy', description: 'We design a clear technology strategy and roadmap aligned to your business priorities, with defined outcomes and milestones.' },
  { step: '03', title: 'Delivery', description: 'Agile, sprint-based delivery with continuous integration, frequent demos, and transparent progress reporting throughout.' },
  { step: '04', title: 'Launch', description: 'Careful, risk-mitigated go-live process with rollback capabilities, monitoring, and hypercare support in the initial weeks.' },
  { step: '05', title: 'Evolve', description: 'Post-launch optimization, performance monitoring, and ongoing support to ensure your solution continues to deliver value.' },
];

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Services', url: `${SITE_CONFIG.url}/services` },
        ]}
      />

      <PageHero
        title="Technology Services"
        description="End-to-end technology solutions delivered by seasoned engineers and consultants who understand business as well as technology."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
      />

      {/* Services grid */}
      <Section className="bg-white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Code2;
              return (
                <Link key={service.slug} href={`/services/${service.slug}`} className="group block">
                  <Card hover padding="lg" className="h-full">
                    <CardIcon
                      icon={<Icon className="h-6 w-6" />}
                      className="group-hover:bg-primary group-hover:text-white transition-colors"
                    />
                    <h2 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-600">{service.shortDescription}</p>
                    <ul className="mb-5 space-y-2">
                      {service.features.slice(0, 3).map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      Explore service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">How We Work</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Delivery Process</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-600">
              A proven, repeatable process that delivers predictable outcomes from kickoff to post-launch.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-white">
                  {step.step}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Not Sure Where to Start?"
        description="Talk to one of our experts. We will help you identify the right services and approach for your specific situation — no sales pressure."
        primaryCta={{ label: 'Book a Free Discovery Call', href: '/contact' }}
      />
    </>
  );
}
