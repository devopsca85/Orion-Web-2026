import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { portfolioItems as staticPortfolioItems } from '@/lib/data/portfolio';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

interface PortfolioDisplayItem {
  slug: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  challenge: string;
  solution: string;
  metrics: { value: string; label: string }[];
  technologies: string[];
}

export const metadata: Metadata = genMeta({
  title: 'Portfolio & Case Studies',
  description:
    'Explore Orion eSolutions case studies — real-world technology transformations across financial services, healthcare, retail, and manufacturing.',
  path: '/portfolio',
  keywords: ['case studies', 'client success', 'technology portfolio', 'enterprise projects'],
});

export default async function PortfolioPage() {
  let items: PortfolioDisplayItem[] = staticPortfolioItems;
  try {
    const rows = await prisma.portfolioItem.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    if (rows.length > 0) {
      items = rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        client: r.client ?? '',
        industry: r.industry ?? '',
        service: r.service ?? '',
        challenge: r.challenge ?? '',
        solution: r.solution ?? '',
        metrics: (r.metrics as { value: string; label: string }[]) ?? [],
        technologies: (r.technologies as string[]) ?? [],
      }));
    }
  } catch { /* fall back to static */ }
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Portfolio', url: `${SITE_CONFIG.url}/portfolio` },
        ]}
      />

      <PageHero
        title="Client Success Stories"
        description="Real technology transformations, measurable business outcomes. Explore how we have helped enterprises across industries achieve their goals."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]}
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Our Work"
            title="Case Studies"
            description="Each engagement is unique. These case studies illustrate the depth and breadth of our delivery capability."
          />

          <div className="space-y-12">
            {items.map((item, index) => (
              <article
                key={item.slug}
                className={`grid gap-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-soft lg:grid-cols-5 lg:gap-12 ${
                  index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-700 lg:col-span-2">
                  <div className="flex h-full min-h-[200px] items-center justify-center p-8">
                    <p className="text-center text-6xl font-extrabold text-white/10">
                      {item.client.charAt(0)}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent p-6">
                    <Badge className="mb-2 w-fit bg-secondary text-white">{item.service}</Badge>
                    <p className="text-sm font-medium text-white/80">{item.industry}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                  <h2 className="mb-1 text-2xl font-bold text-gray-900">{item.title}</h2>
                  <p className="mb-4 text-sm font-medium text-gray-400">{item.client}</p>

                  <div className="mb-4">
                    <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-400">Challenge</h3>
                    <p className="text-gray-600">{item.challenge}</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-400">Solution</h3>
                    <p className="text-gray-600">{item.solution}</p>
                  </div>

                  {/* Metrics */}
                  <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {item.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-xl bg-gray-50 p-3 text-center">
                        <p className="text-lg font-extrabold text-primary">{metric.value}</p>
                        <p className="text-xs text-gray-500">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="default">{tech}</Badge>
                    ))}
                  </div>

                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-700 transition-colors"
                  >
                    Read full case study <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Ready to Write Your Success Story?"
        description="Join 150+ enterprises that have transformed their technology with Orion eSolutions."
        primaryCta={{ label: 'Get a Free Consultation', href: '/contact' }}
      />
    </>
  );
}
