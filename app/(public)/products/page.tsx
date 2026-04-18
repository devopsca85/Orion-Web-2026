import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/sections/Hero'
import { Container, Section } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: `Products — ${SITE_CONFIG.name}`,
  description: 'Explore Orion eSolutions\' suite of enterprise software products.',
}

const PRODUCTS = [
  { slug: 'orion-erp', title: 'Orion ERP', description: 'End-to-end enterprise resource planning tailored for growing businesses.', icon: '🏭' },
  { slug: 'orion-crm', title: 'Orion CRM', description: 'Customer relationship management to drive sales and retention.', icon: '🤝' },
  { slug: 'orion-analytics', title: 'Orion Analytics', description: 'Business intelligence dashboards and real-time data insights.', icon: '📊' },
  { slug: 'orion-hr-suite', title: 'Orion HR Suite', description: 'Complete human resources management from onboarding to payroll.', icon: '👥' },
  { slug: 'orion-customer-portal', title: 'Orion Customer Portal', description: 'Self-service portal to strengthen customer engagement.', icon: '🌐' },
]

export default function ProductsPage() {
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
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="text-4xl">{p.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                </div>
                <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-auto">
                  Learn more <ArrowRight size={15} />
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
