import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/sections/Hero'
import { Container, Section } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: `Case Studies — ${SITE_CONFIG.name}`,
  description: 'Explore how Orion eSolutions has helped businesses achieve digital excellence.',
}

export default async function CaseStudiesPage() {
  let items: { slug: string; title: string; client: string; industry: string; service: string; imageUrl: string | null }[] = []
  try {
    items = await prisma.portfolioItem.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
      select: { slug: true, title: true, client: true, industry: true, service: true, imageUrl: true },
    })
  } catch { /* DB not ready */ }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Case Studies', url: `${SITE_CONFIG.url}/case-studies` },
      ]} />

      <PageHero
        title="Case Studies"
        description="Real results for real businesses. Explore how we've helped our clients achieve digital excellence."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Case Studies' }]}
      />

      <Section className="bg-white">
        <Container>
          {items.length === 0 ? (
            <div className="text-center py-16">
              <span className="inline-flex bg-primary/5 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                Coming Soon
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">We&apos;re documenting our wins</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Detailed case studies are being prepared. In the meantime, visit our Portfolio or contact us to hear about specific projects.
              </p>
              <Link href="/portfolio" className="inline-flex items-center gap-2 mt-6 text-primary font-semibold hover:underline">
                View Portfolio <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-soft hover:shadow-md hover:border-primary/20 transition-all"
                >
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="h-48 w-full bg-primary/5 flex items-center justify-center">
                      <span className="text-4xl">📁</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary">{item.industry}</Badge>
                      <Badge variant="default">{item.service}</Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.client}</p>
                    <div className="mt-auto flex items-center gap-1 text-primary text-sm font-semibold">
                      Read case study <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <CTA
        title="Want Results Like These?"
        description="Let's talk about how we can deliver similar outcomes for your business."
        primaryCta={{ label: 'Start a Project', href: '/contact' }}
        variant="primary"
      />
    </>
  )
}
