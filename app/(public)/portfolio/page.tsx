import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
  imageUrl: string | null;
}

export const metadata: Metadata = genMeta({
  title: 'Portfolio & Case Studies',
  description:
    'Explore Orion eSolutions case studies — real-world technology transformations across financial services, healthcare, retail, and manufacturing.',
  path: '/portfolio',
  keywords: ['case studies', 'client success', 'technology portfolio', 'enterprise projects'],
});

export default async function PortfolioPage() {
  let items: PortfolioDisplayItem[] = staticPortfolioItems.map((r) => ({ ...r, imageUrl: null }));
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
        imageUrl: r.imageUrl ?? null,
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.slug}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary to-primary-700">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-6xl font-bold text-white/10 select-none">{item.client.charAt(0)}</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-secondary text-white">{item.service}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">{item.industry}</p>
                  <h2 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h2>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">{item.challenge}</p>

                  {item.metrics.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
                      {item.metrics.slice(0, 2).map((metric) => (
                        <div key={metric.label}>
                          <p className="text-sm font-bold text-primary">{metric.value}</p>
                          <p className="text-xs text-gray-500">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                  >
                    View case study <ArrowRight className="h-4 w-4" />
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
