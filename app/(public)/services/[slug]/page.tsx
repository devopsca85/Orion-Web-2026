import type { Metadata } from 'next'
import { ServiceHero, type ServiceStat } from '@/components/sections/ServiceHero'
import { Container, Section } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { CheckCircle2 } from 'lucide-react'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = [
    'artificial-intelligence','application-development','cloud-services','technology-development',
    'ai-development','generative-ai-development','llm-development','hire-machine-learning-developers',
    'nlp-services','ai-consulting','software-development','custom-application-development',
    'web-development','mobile-application-development','it-staff-augmentation','qa-services',
    'erp-development','devops-consulting','cloud-managed-services','cloud-migration-services',
    'crm-development','cybersecurity','managed-it-services','react-js-development',
    'react-native-development','ionic-app-development','dot-net-development',
    'codeigniter-development','api-web-services','zend-web-development',
  ]
  return slugs.map((slug) => ({ slug }))
}

interface Props { params: Promise<{ slug: string }> }

function slugToTitle(slug: string) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const s = await prisma.service.findUnique({ where: { slug }, select: { title: true, metaTitle: true, metaDescription: true } })
    if (s) return { title: s.metaTitle || `${s.title} — ${SITE_CONFIG.name}`, description: s.metaDescription || undefined }
  } catch { /* DB not ready */ }
  return { title: `${slugToTitle(slug)} — ${SITE_CONFIG.name}` }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params

  let service: {
    title: string; shortDesc: string; description: string
    features: unknown; benefits: unknown; technologies: unknown
    heroBadge: string | null; heroHighlight: string | null
    heroSubtext: string | null; heroImageUrl: string | null; heroStats: unknown
  } | null = null

  try {
    service = await prisma.service.findUnique({
      where: { slug, published: true },
      select: {
        title: true, shortDesc: true, description: true,
        features: true, benefits: true, technologies: true,
        heroBadge: true, heroHighlight: true, heroSubtext: true,
        heroImageUrl: true, heroStats: true,
      },
    })
  } catch { /* DB not ready */ }

  const title        = service?.title        || slugToTitle(slug)
  const description  = service?.shortDesc    || `Expert ${title} services tailored to your business needs.`
  const features     = Array.isArray(service?.features)     ? service!.features     as string[] : []
  const benefits     = Array.isArray(service?.benefits)     ? service!.benefits     as string[] : []
  const technologies = Array.isArray(service?.technologies) ? service!.technologies as string[] : []
  const heroStats    = Array.isArray(service?.heroStats)    ? service!.heroStats    as ServiceStat[] : []

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Services', url: `${SITE_CONFIG.url}/services` },
        { name: title, url: `${SITE_CONFIG.url}/services/${slug}` },
      ]} />

      <ServiceHero
        title={title}
        highlight={service?.heroHighlight ?? undefined}
        badge={service?.heroBadge ?? undefined}
        subtext={service?.heroSubtext ?? '12+ Years of Experience | Diverse Expertise | 24×7 Support'}
        description={description}
        stats={heroStats}
        imageUrl={service?.heroImageUrl ?? undefined}
        serviceName={title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: title },
        ]}
      />

      {(service?.description || features.length > 0 || benefits.length > 0 || technologies.length > 0) && (
        <Section className="bg-white">
          <Container>
            {service?.description ? (
              <div className="prose prose-gray max-w-4xl mx-auto mb-12" dangerouslySetInnerHTML={{ __html: service.description }} />
            ) : (
              <div className="max-w-4xl mx-auto text-center py-12">
                <span className="inline-flex items-center gap-2 bg-primary/5 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  Content Coming Soon
                </span>
                <p className="text-lg text-gray-600">
                  We are building out this page. Contact us to learn how our {title} expertise can drive results for your business.
                </p>
              </div>
            )}

            {features.length > 0 && (
              <div className="mt-12 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map((f) => (
                    <div key={f} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {benefits.length > 0 && (
              <div className="mt-10 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {technologies.length > 0 && (
              <div className="mt-10 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <span key={t} className="text-sm bg-primary/5 text-primary font-medium px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </Section>
      )}

      <CTA
        title={`Ready to Get Started with ${title}?`}
        description="Let's discuss how our expertise can help your business grow."
        primaryCta={{ label: 'Get a Free Consultation', href: '/contact' }}
        variant="primary"
      />
    </>
  )
}
