import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Play, BookOpen, FileText, BarChart3, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { resources, type ResourceType } from '@/lib/data/resources';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = genMeta({
  title: 'Resources — Guides, Whitepapers & Webinars',
  description: 'Free technology resources from Orion eSolutions: cloud migration guides, AI reports, cybersecurity whitepapers, webinar recordings, and digital transformation ebooks.',
  path: '/resources',
  keywords: ['technology resources', 'whitepapers', 'IT guides', 'cloud webinars', 'free download'],
});

const typeIcon: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  whitepaper: FileText, guide: BookOpen, webinar: Play, ebook: BookOpen, report: BarChart3,
};
const typeLabel: Record<ResourceType, string> = {
  whitepaper: 'Whitepaper', guide: 'Guide', webinar: 'Webinar', ebook: 'eBook', report: 'Report',
};

export default function ResourcesPage() {
  const featured = resources.slice(0, 2);
  const rest = resources.slice(2);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Resources', url: `${SITE_CONFIG.url}/resources` },
      ]} />

      <PageHero
        title="Resources & Insights"
        description="Practical guides, research reports, and on-demand webinars from the Orion eSolutions team. Free to download — no strings attached."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />

      {/* Featured resources */}
      <Section className="bg-white">
        <Container>
          <SectionHeader eyebrow="Featured" title="Latest Resources" />
          <div className="grid gap-6 lg:grid-cols-2">
            {featured.map((resource) => {
              const Icon = typeIcon[resource.type];
              return (
                <Card key={resource.slug} padding="lg" className="flex gap-6">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge variant="primary">{typeLabel[resource.type]}</Badge>
                      <Badge variant="default">{resource.topic}</Badge>
                    </div>
                    <h2 className="mb-2 font-bold text-gray-900 leading-snug">{resource.title}</h2>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600">{resource.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{formatDate(resource.publishedAt)}</span>
                      <Link href={`/resources/${resource.slug}`} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                        {resource.gated ? <><Download className="h-4 w-4" /> Download</> : <><Play className="h-4 w-4" /> Watch</>}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* All resources grid */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader eyebrow="Library" title="All Resources" centered={false} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((resource) => {
              const Icon = typeIcon[resource.type];
              return (
                <Link key={resource.slug} href={`/resources/${resource.slug}`} className="group block">
                  <Card hover padding="lg" className="h-full flex flex-col">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="primary">{typeLabel[resource.type]}</Badge>
                        <Badge variant="default">{resource.topic}</Badge>
                      </div>
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900 group-hover:text-primary transition-colors flex-1">{resource.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{resource.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs text-gray-400">{formatDate(resource.publishedAt)}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        {resource.gated ? 'Download' : 'Watch'} <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <CTA
        title="Want Resources Tailored to Your Situation?"
        description="Our consultants can provide bespoke briefings and assessments specific to your technology challenges."
        primaryCta={{ label: 'Request a Custom Briefing', href: '/contact' }}
        variant="light"
      />
    </>
  );
}
