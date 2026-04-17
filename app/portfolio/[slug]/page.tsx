import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { portfolioItems, getPortfolioBySlug } from '@/lib/data/portfolio';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioBySlug(slug);
  if (!item) return {};
  return genMeta({
    title: item.title,
    description: `${item.title}: ${item.outcome}`,
    path: `/portfolio/${slug}`,
    keywords: [item.industry, item.service, ...item.technologies],
  });
}

export default async function PortfolioCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPortfolioBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Portfolio', url: `${SITE_CONFIG.url}/portfolio` },
          { name: item.title, url: `${SITE_CONFIG.url}/portfolio/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary to-primary-800" />
        <Container className="relative z-10">
          <Link
            href="/portfolio"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <Badge className="bg-secondary text-white">{item.service}</Badge>
            <Badge className="border border-white/20 bg-white/10 text-white">{item.industry}</Badge>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white sm:text-5xl">{item.title}</h1>
          <p className="text-lg text-white/70">{item.client}</p>
        </Container>
      </section>

      <Section className="bg-white">
        <Container>
          {/* Metrics banner */}
          <div className="mb-12 grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-6 md:grid-cols-4">
            {item.metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-2xl font-extrabold text-primary md:text-3xl">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="mb-3 text-xl font-bold text-gray-900">The Challenge</h2>
                <p className="leading-relaxed text-gray-600">{item.challenge}</p>
              </div>
              <div>
                <h2 className="mb-3 text-xl font-bold text-gray-900">Our Solution</h2>
                <p className="leading-relaxed text-gray-600">{item.solution}</p>
              </div>
              <div>
                <h2 className="mb-3 text-xl font-bold text-gray-900">The Outcome</h2>
                <p className="leading-relaxed text-gray-600">{item.outcome}</p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-4 font-bold text-gray-900">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="primary">{tech}</Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-primary p-6 text-white">
                <h3 className="mb-3 font-bold">Want Similar Results?</h3>
                <p className="mb-4 text-sm text-white/80">
                  Let&apos;s talk about your specific challenge and how we can help.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary-600"
                >
                  Book a Free Consultation
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CTA
        title="Start Your Transformation"
        description="Tell us about your challenge and let&apos;s design a solution together."
        primaryCta={{ label: 'Get in Touch', href: '/contact' }}
        secondaryCta={{ label: 'More Case Studies', href: '/portfolio' }}
      />
    </>
  );
}
