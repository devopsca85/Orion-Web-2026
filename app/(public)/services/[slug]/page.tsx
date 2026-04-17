import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema, ServiceSchema } from '@/components/seo/JsonLd';
import { services, getServiceBySlug } from '@/lib/data/services';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return genMeta({
    title: service.metaTitle || service.title,
    description: service.metaDescription || service.description,
    path: `/services/${service.slug}`,
    keywords: [service.title, ...service.technologies],
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Services', url: `${SITE_CONFIG.url}/services` },
          { name: service.title, url: `${SITE_CONFIG.url}/services/${service.slug}` },
        ]}
      />
      <ServiceSchema
        name={service.title}
        description={service.description}
        url={`${SITE_CONFIG.url}/services/${service.slug}`}
      />

      <PageHero
        title={service.title}
        description={service.shortDescription}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.title },
        ]}
      />

      {/* Overview */}
      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Overview</h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">{service.description}</p>

              <h3 className="mb-4 text-xl font-bold text-gray-900">What We Deliver</h3>
              <ul className="mb-8 space-y-3">
                {service.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-secondary mt-0.5" />
                    <span className="text-gray-700">{feat}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mb-4 text-xl font-bold text-gray-900">Key Benefits</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <p className="text-sm font-medium text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <Card padding="lg">
                <h3 className="mb-4 font-bold text-gray-900">Technologies We Use</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <Badge key={tech} variant="primary">{tech}</Badge>
                  ))}
                </div>
              </Card>

              <Card padding="lg" className="border-primary/20 bg-primary/5">
                <h3 className="mb-3 font-bold text-gray-900">Ready to Get Started?</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Speak with one of our {service.title.toLowerCase()} experts. Free 30-minute consultation.
                </p>
                <a
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Book a Free Call <ArrowRight className="h-4 w-4" />
                </a>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <Section className="bg-gray-50">
          <Container>
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Related Services</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {relatedServices.map((related) => (
                <a
                  key={related.slug}
                  href={`/services/${related.slug}`}
                  className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <h3 className="mb-2 font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600">{related.shortDescription}</p>
                </a>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTA
        title={`Start Your ${service.title} Journey`}
        description="Let's discuss your specific needs and how we can help you achieve your technology goals."
        primaryCta={{ label: 'Talk to an Expert', href: '/contact' }}
        secondaryCta={{ label: 'View Case Studies', href: '/portfolio' }}
      />
    </>
  );
}
