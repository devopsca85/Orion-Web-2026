import type { Metadata } from 'next';
import { Leaf, BookOpen, Users, Globe2 } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Corporate Social Responsibility',
  description: 'Orion eSolutions is committed to environmental sustainability, STEM education, community investment, and building a more inclusive technology industry.',
  path: '/about/csr',
});

const initiatives = [
  {
    icon: Leaf,
    title: 'Environmental Sustainability',
    description: 'We are committed to reducing our environmental footprint and helping clients build greener technology infrastructure.',
    actions: ['Carbon neutral operations since 2023 via verified offsets', 'Cloud-first approach reduces on-premise energy consumption for clients', 'Green cloud architecture guidance included in every cloud engagement', 'Annual environmental impact report published publicly'],
  },
  {
    icon: BookOpen,
    title: 'STEM Education',
    description: 'We invest in the next generation of technology talent through mentorship, scholarships, and partnerships with educational institutions.',
    actions: ['$250,000/year in STEM scholarships for underrepresented students', 'Orion Tech Fellows program — 12 paid internships per year', 'Curriculum partnerships with 5 universities across the US and UK', '200+ volunteer mentoring hours logged by staff annually'],
  },
  {
    icon: Users,
    title: 'Inclusion & Diversity',
    description: 'We actively work to make the technology industry more inclusive through hiring practices, pay equity, and industry advocacy.',
    actions: ['42% of technical staff identify as women or non-binary', 'Annual third-party pay equity audit — results published internally', 'Partnership with Code2040, Lesbians Who Tech, and Out in Tech', 'Blind résumé screening piloted in 2024 across all engineering roles'],
  },
  {
    icon: Globe2,
    title: 'Community Investment',
    description: 'Our teams volunteer time and expertise in the communities where we operate, with a focus on digital literacy and nonprofit technology.',
    actions: ['Free technology consulting for registered non-profits (40 hrs/year/team)', 'Digital literacy workshops in underserved communities — 3 cities', 'Matching program: company matches employee charitable donations 1:1 up to $2,500/year', '10 days/year paid volunteer time for all full-time employees'],
  },
];

export default function CSRPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'About', url: `${SITE_CONFIG.url}/about` },
        { name: 'Corporate Responsibility', url: `${SITE_CONFIG.url}/about/csr` },
      ]} />

      <PageHero
        title="Corporate Responsibility"
        description="Technology companies have a responsibility to society that goes beyond the products they build. Here is how we take that responsibility seriously."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Responsibility' }]}
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Our Commitment"
            title="Technology For Good"
            description="We measure our success not just in revenue and client satisfaction, but in the positive impact we have on our people, our communities, and our planet."
          />
          <div className="grid gap-8 md:grid-cols-2">
            {initiatives.map((init) => {
              const Icon = init.icon;
              return (
                <Card key={init.title} padding="lg">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mb-2 text-lg font-bold text-gray-900">{init.title}</h2>
                  <p className="mb-4 text-gray-600">{init.description}</p>
                  <ul className="space-y-2">
                    {init.actions.map((action) => (
                      <li key={action} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <CTA
        title="Partnering on Social Impact?"
        description="If you are a non-profit, educational institution, or social enterprise with a technology need, reach out — we may be able to help."
        primaryCta={{ label: 'Get in Touch', href: '/contact' }}
        variant="light"
      />
    </>
  );
}
