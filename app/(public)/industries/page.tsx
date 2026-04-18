import type { Metadata } from 'next'
import Link from 'next/link'
import { HeartPulse, Landmark, ShoppingCart, GraduationCap, Factory, Building2, MapPin, Truck, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/sections/Hero'
import { Container, Section, SectionHeader } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Industries We Serve — ${SITE_CONFIG.name}`,
  description: 'Orion eSolutions delivers industry-specific technology solutions across healthcare, finance, retail, education, manufacturing, and more.',
}

const INDUSTRIES = [
  { slug: 'healthcare',              title: 'Healthcare & Life Sciences', icon: HeartPulse, description: 'EHR integrations, telemedicine, and HIPAA-compliant software.' },
  { slug: 'finance-banking',         title: 'Finance & Banking',          icon: Landmark,   description: 'Secure fintech platforms, digital banking, and compliance tools.' },
  { slug: 'retail-ecommerce',        title: 'Retail & E-Commerce',        icon: ShoppingCart, description: 'Omni-channel commerce, inventory, and customer experience.' },
  { slug: 'education',               title: 'Education & EdTech',         icon: GraduationCap, description: 'LMS platforms, virtual classrooms, and e-learning tools.' },
  { slug: 'manufacturing',           title: 'Manufacturing',              icon: Factory,    description: 'Smart factory IoT, ERP integrations, and production automation.' },
  { slug: 'real-estate',             title: 'Real Estate',                icon: Building2,  description: 'Property portals, CRM, and transaction management systems.' },
  { slug: 'government',              title: 'Government',                 icon: MapPin,     description: 'Digital citizen services and secure public sector infrastructure.' },
  { slug: 'logistics-transportation',title: 'Logistics & Transportation',  icon: Truck,      description: 'Fleet tracking, supply chain, and warehouse management.' },
]

export default function IndustriesPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Industries', url: `${SITE_CONFIG.url}/industries` },
      ]} />

      <PageHero
        title="Industries We Serve"
        description="We bring deep domain expertise and cutting-edge technology to businesses across every major industry vertical."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Industries' }]}
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Our Expertise"
            title="Tailored Solutions for Every Sector"
            description="Orion eSolutions understands that each industry has unique challenges. We combine technical depth with domain knowledge to deliver solutions that truly fit."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map(({ slug, title, icon: Icon, description }) => (
              <Link
                key={slug}
                href={`/industries/${slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{description}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-1">
                  Learn more <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Serving Your Industry"
        description="Tell us about your business and we'll show you what's possible."
        primaryCta={{ label: 'Get in Touch', href: '/contact' }}
        variant="primary"
      />
    </>
  )
}
