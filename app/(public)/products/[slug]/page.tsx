import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/Hero'
import { Container, Section } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { CheckCircle2 } from 'lucide-react'

const STATIC: Record<string, { title: string; tagline: string; features: string[] }> = {
  'orion-erp':             { title: 'Orion ERP',             tagline: 'Streamline your operations with our comprehensive enterprise resource planning platform.', features: ['Finance & Accounting','Inventory Management','Supply Chain','Procurement','HR & Payroll','Reporting & Analytics'] },
  'orion-crm':             { title: 'Orion CRM',             tagline: 'Build stronger customer relationships and close more deals with Orion CRM.',               features: ['Sales Pipeline','Contact Management','Email Integration','Reporting','Mobile App','Automation'] },
  'orion-analytics':       { title: 'Orion Analytics',       tagline: 'Turn your data into actionable insights with real-time business intelligence dashboards.',   features: ['Real-time Dashboards','Custom Reports','Data Integration','Predictive Analytics','Export & Sharing','Role-based Access'] },
  'orion-hr-suite':        { title: 'Orion HR Suite',        tagline: 'Manage your entire employee lifecycle from recruitment to retirement.',                       features: ['Recruitment & Onboarding','Payroll Processing','Leave Management','Performance Reviews','Training Tracker','Compliance'] },
  'orion-customer-portal': { title: 'Orion Customer Portal', tagline: 'Give your customers a self-service portal for support, invoices, and project tracking.',      features: ['Ticket Management','Invoice Access','Project Tracker','Knowledge Base','Secure Login','White-label Ready'] },
}

export async function generateStaticParams() {
  return Object.keys(STATIC).map((slug) => ({ slug }))
}

interface Props { params: Promise<{ slug: string }> }

function slugToTitle(s: string) {
  return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const p = await prisma.product.findUnique({ where: { slug }, select: { title: true, metaTitle: true, metaDesc: true } })
    if (p) return { title: p.metaTitle || `${p.title} — ${SITE_CONFIG.name}`, description: p.metaDesc || undefined }
  } catch { /* DB not ready */ }
  const s = STATIC[slug]
  return { title: `${s?.title || slugToTitle(slug)} — ${SITE_CONFIG.name}` }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  let product: { title: string; tagline: string; description: string; logoUrl: string | null; features: unknown } | null = null
  try {
    product = await prisma.product.findUnique({
      where: { slug, published: true },
      select: { title: true, tagline: true, description: true, logoUrl: true, features: true },
    })
  } catch { /* DB not ready */ }

  const fallback  = STATIC[slug]
  const title     = product?.title    || fallback?.title    || slugToTitle(slug)
  const tagline   = product?.tagline  || fallback?.tagline  || `Learn more about ${title} from Orion eSolutions.`
  const features  = Array.isArray(product?.features) ? product!.features as string[] : (fallback?.features || [])

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Products', url: `${SITE_CONFIG.url}/products` },
        { name: title, url: `${SITE_CONFIG.url}/products/${slug}` },
      ]} />

      <PageHero
        title={title}
        description={tagline}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: title }]}
      />

      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {product?.description ? (
              <div className="prose prose-gray mb-12" dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : null}

            {features.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {features.map((f) => (
                    <div key={f} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!product?.description && (
              <div className="text-center py-8">
                <span className="inline-flex bg-primary/5 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
                  Full details coming soon
                </span>
                <p className="text-gray-600">Contact us for a live demo and pricing information.</p>
              </div>
            )}
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
