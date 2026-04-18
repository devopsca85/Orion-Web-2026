import type { Metadata } from 'next'
export const revalidate = 3600
import Link from 'next/link'
import { PageHero } from '@/components/sections/Hero'
import { Container, Section } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: `Products — ${SITE_CONFIG.name}`,
  description: "Explore Orion eSolutions' suite of enterprise software products.",
}

const STATIC_PRODUCTS = [
  { slug: 'orion-erp',             title: 'Orion ERP',             tagline: 'End-to-end enterprise resource planning tailored for growing businesses.',    logoUrl: '/assets/images/logo.png' },
  { slug: 'orion-crm',             title: 'Orion CRM',             tagline: 'Customer relationship management to drive sales and retention.',                logoUrl: '/assets/images/logo.png' },
  { slug: 'orion-analytics',       title: 'Orion Analytics',       tagline: 'Business intelligence dashboards and real-time data insights.',                  logoUrl: '/assets/images/logo.png' },
  { slug: 'orion-hr-suite',        title: 'Orion HR Suite',        tagline: 'Complete human resources management from onboarding to payroll.',                logoUrl: '/assets/images/logo.png' },
  { slug: 'orion-customer-portal', title: 'Orion Customer Portal', tagline: 'Self-service portal to strengthen customer engagement.',                         logoUrl: '/assets/images/logo.png' },
]

export default async function ProductsPage() {
  let dbProducts: { slug: string; title: string; tagline: string; logoUrl: string | null }[] = []
  try {
    dbProducts = await prisma.product.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      select: { slug: true, title: true, tagline: true, logoUrl: true },
    })
  } catch { /* DB not ready */ }

  const products = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Products', url: `${SITE_CONFIG.url}/products` },
      ]} />

      <PageHero
        title="Our Products"
        description="Purpose-built software products to accelerate your business operations."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      />

      <Section className="bg-white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  {p.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logoUrl} alt={p.title} className="h-10 w-auto object-contain" />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-secondary">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Looking for a Custom Solution?"
        description="We build bespoke software products tailored to your exact requirements."
        primaryCta={{ label: 'Talk to Us', href: '/contact' }}
        variant="primary"
      />
    </>
  )
}
