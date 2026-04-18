import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/Hero'
import { Container, Section } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'

const INDUSTRIES: Record<string, { title: string; description: string }> = {
  'healthcare':              { title: 'Healthcare & Life Sciences', description: 'Technology solutions for hospitals, clinics, and life sciences organizations.' },
  'finance-banking':         { title: 'Finance & Banking',          description: 'Secure, compliant software for financial institutions and fintech companies.' },
  'retail-ecommerce':        { title: 'Retail & E-Commerce',        description: 'Digital commerce platforms, inventory management, and customer experience solutions.' },
  'education':               { title: 'Education & EdTech',         description: 'Learning management systems and digital platforms for educational institutions.' },
  'manufacturing':           { title: 'Manufacturing',              description: 'Smart factory solutions, ERP integrations, and industrial IoT for manufacturers.' },
  'real-estate':             { title: 'Real Estate',               description: 'Property management platforms and CRM solutions for real estate businesses.' },
  'government':              { title: 'Government',                 description: 'Secure digital transformation and citizen services for public sector organizations.' },
  'logistics-transportation':{ title: 'Logistics & Transportation', description: 'Supply chain management and fleet tracking solutions for logistics companies.' },
}

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES).map((slug) => ({ slug }))
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ind = INDUSTRIES[slug]
  const title = ind?.title || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { title: `${title} Technology Solutions — ${SITE_CONFIG.name}` }
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params
  const ind = INDUSTRIES[slug]
  const title = ind?.title || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const description = ind?.description || `Technology solutions tailored for the ${title} industry.`

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Industries', url: `${SITE_CONFIG.url}/industries` },
        { name: title, url: `${SITE_CONFIG.url}/industries/${slug}` },
      ]} />

      <PageHero
        title={title}
        description={description}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: title }]}
      />

      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-12">
            <span className="inline-flex bg-primary/5 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              Content Coming Soon
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Industry-Specific Solutions for {title}
            </h2>
            <p className="text-lg text-gray-600">
              We are building out detailed case studies and solution overviews for this industry.
              Contact us to discuss how Orion eSolutions can help your {title} organisation.
            </p>
          </div>
        </Container>
      </Section>

      <CTA
        title={`Transform Your ${title} Business`}
        description="Talk to our industry experts about custom technology solutions."
        primaryCta={{ label: 'Get a Free Consultation', href: '/contact' }}
        variant="primary"
      />
    </>
  )
}
