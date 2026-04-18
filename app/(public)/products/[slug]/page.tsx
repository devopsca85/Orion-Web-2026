import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/Hero'
import { Container, Section } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'

const PRODUCTS: Record<string, { title: string; description: string; features: string[] }> = {
  'orion-erp': {
    title: 'Orion ERP',
    description: 'Streamline your operations with our comprehensive enterprise resource planning platform.',
    features: ['Finance & Accounting', 'Inventory Management', 'Supply Chain', 'Procurement', 'HR & Payroll', 'Reporting & Analytics'],
  },
  'orion-crm': {
    title: 'Orion CRM',
    description: 'Build stronger customer relationships and close more deals with Orion CRM.',
    features: ['Sales Pipeline', 'Contact Management', 'Email Integration', 'Reporting', 'Mobile App', 'Automation'],
  },
  'orion-analytics': {
    title: 'Orion Analytics',
    description: 'Turn your data into actionable insights with real-time business intelligence dashboards.',
    features: ['Real-time Dashboards', 'Custom Reports', 'Data Integration', 'Predictive Analytics', 'Export & Sharing', 'Role-based Access'],
  },
  'orion-hr-suite': {
    title: 'Orion HR Suite',
    description: 'Manage your entire employee lifecycle from recruitment to retirement.',
    features: ['Recruitment & Onboarding', 'Payroll Processing', 'Leave Management', 'Performance Reviews', 'Training Tracker', 'Compliance'],
  },
  'orion-customer-portal': {
    title: 'Orion Customer Portal',
    description: 'Give your customers a self-service portal for support, invoices, and project tracking.',
    features: ['Ticket Management', 'Invoice Access', 'Project Tracker', 'Knowledge Base', 'Secure Login', 'White-label Ready'],
  },
}

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }))
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = PRODUCTS[slug]
  return { title: `${p?.title || slug} — ${SITE_CONFIG.name}` }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const p = PRODUCTS[slug]
  const title       = p?.title || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const description = p?.description || `Learn more about ${title} from Orion eSolutions.`
  const features    = p?.features || []

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Products', url: `${SITE_CONFIG.url}/products` },
        { name: title, url: `${SITE_CONFIG.url}/products/${slug}` },
      ]} />

      <PageHero
        title={title}
        description={description}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: title }]}
      />

      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {features.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {features.map((f) => (
                    <div key={f} className="bg-gray-50 rounded-xl p-4 text-sm font-medium text-gray-700">✓ {f}</div>
                  ))}
                </div>
              </>
            ) : null}

            <div className="text-center py-8">
              <span className="inline-flex bg-primary/5 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Full details coming soon
              </span>
              <p className="text-gray-600">Contact us for a live demo and pricing information.</p>
            </div>
          </div>
        </Container>
      </Section>

      <CTA
        title={`Interested in ${title}?`}
        description="Request a demo and see how it can transform your business."
        primaryCta={{ label: 'Request a Demo', href: '/contact' }}
        variant="primary"
      />
    </>
  )
}
