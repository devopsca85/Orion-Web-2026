import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { industries, getIndustryBySlug } from '@/lib/data/industries';
import { services } from '@/lib/data/services';
import { getFeaturedPortfolio } from '@/lib/data/portfolio';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};
  return genMeta({
    title: industry.metaTitle || industry.title,
    description: industry.metaDescription || industry.description,
    path: `/industries/${slug}`,
    keywords: [industry.title, 'industry solutions', 'IT consulting'],
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const relatedServices = services.filter((s) => industry.services.includes(s.slug));
  const relatedPortfolio = getFeaturedPortfolio().filter((p) => p.industry.toLowerCase().includes(industry.title.split(' ')[0].toLowerCase())).slice(0, 2);
  const otherIndustries = industries.filter((i) => i.slug !== slug).slice(0, 4);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Industries', url: `${SITE_CONFIG.url}/industries` },
        { name: industry.title, url: `${SITE_CONFIG.url}/industries/${slug}` },
      ]} />

      <PageHero
        title={industry.title}
        description={industry.shortDescription}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Industries', href: '/industries' },
          { label: industry.title },
        ]}
      />

      {/* Stats banner */}
      <div className="bg-white border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            {industry.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-primary md:text-3xl">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Industry Overview</h2>
                <p className="text-lg leading-relaxed text-gray-600">{industry.description}</p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Key Challenges We Solve</h2>
                <ul className="space-y-3">
                  {industry.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-secondary" />
                      <span className="text-gray-700">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Solutions</h2>
                <ul className="space-y-3">
                  {industry.solutions.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-secondary mt-0.5" />
                      <span className="text-gray-700">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related case studies */}
              {relatedPortfolio.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">Case Studies</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {relatedPortfolio.map((item) => (
                      <Link key={item.slug} href={`/portfolio/${item.slug}`} className="group block rounded-xl border border-gray-100 bg-gray-50 p-5 hover:border-primary/30 hover:bg-white transition-all">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{item.client}</p>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                          Read case study <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <Card padding="lg">
                <h3 className="mb-4 font-bold text-gray-900">Relevant Services</h3>
                <ul className="space-y-3">
                  {relatedServices.map((service) => (
                    <li key={service.slug}>
                      <Link href={`/services/${service.slug}`} className="flex items-center justify-between text-sm text-gray-700 hover:text-primary transition-colors group">
                        {service.title}
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card padding="lg" className="border-primary/20 bg-primary/5">
                <h3 className="mb-3 font-bold text-gray-900">Speak to a {industry.title} Expert</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Our {industry.title.toLowerCase()} practice leads are available for a free 30-minute consultation.
                </p>
                <Link href="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                  Book a Free Call <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>

              <Card padding="md">
                <h3 className="mb-3 text-sm font-bold text-gray-900">Other Industries</h3>
                <ul className="space-y-2">
                  {otherIndustries.map((i) => (
                    <li key={i.slug}>
                      <Link href={`/industries/${i.slug}`} className="text-sm text-gray-600 hover:text-primary transition-colors">
                        {i.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>

      <CTA
        title={`Ready to Solve Your ${industry.title} Technology Challenges?`}
        description="Let's discuss your specific situation and design a solution tailored to your industry's unique requirements."
        primaryCta={{ label: 'Start a Conversation', href: '/contact' }}
        secondaryCta={{ label: 'View All Services', href: '/services' }}
      />
    </>
  );
}
