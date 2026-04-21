import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { getFeaturedPortfolio } from '@/lib/data/portfolio';
import { prisma } from '@/lib/prisma';

interface Metric { label: string; value: string }

interface PortfolioCardData {
  slug: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  challenge: string;
  metrics: Metric[];
}

function PortfolioCard({ item }: { item: PortfolioCardData }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary to-primary-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-6xl font-bold text-white/10 select-none">{item.client.charAt(0)}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-secondary text-white">{item.service}</Badge>
        </div>
      </div>
      <div className="p-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">{item.industry}</p>
        <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">{item.challenge}</p>
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
          {item.metrics.slice(0, 2).map((metric) => (
            <div key={metric.label}>
              <p className="text-sm font-bold text-primary">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>
        <Link href={`/portfolio/${item.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
          View case study <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

interface PortfolioGridProps {
  showAll?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export async function PortfolioGrid({
  showAll = false,
  eyebrow = 'Our Work',
  title = 'Proven Results Across Industries',
  description = 'From cloud migrations to AI-powered platforms, explore how we have helped enterprises achieve their technology ambitions.',
}: PortfolioGridProps) {
  let dbItems: PortfolioCardData[] = [];
  try {
    const rows = await prisma.portfolioItem.findMany({
      where: { published: true, ...(showAll ? {} : { featured: true }) },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: showAll ? undefined : 3,
      select: { slug: true, title: true, client: true, industry: true, service: true, challenge: true, metrics: true },
    });
    dbItems = rows.map((r) => ({
      ...r,
      metrics: (r.metrics as unknown as Metric[]) ?? [],
    }));
  } catch { /* fall back */ }

  const staticItems = getFeaturedPortfolio();
  const items: PortfolioCardData[] = dbItems.length > 0
    ? dbItems
    : (showAll ? staticItems : staticItems.slice(0, 3));

  return (
    <Section className="bg-white">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <PortfolioCard key={item.slug} item={item} />)}
        </div>
        {!showAll && (
          <div className="mt-12 text-center">
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-700 transition-colors">
              View all case studies <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
