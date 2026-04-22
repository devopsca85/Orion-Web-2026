import type { Metadata } from 'next';
import { CheckCircle, Award, Globe2, Users } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Stats } from '@/components/sections/Stats';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { Card } from '@/components/ui/Card';
import { leadership } from '@/lib/data/team';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'About Us',
  description:
    'Orion eSolutions is a leading technology partner for enterprises. Learn about our mission, values, leadership team, and the story behind 12+ years of delivering transformative technology solutions.',
  path: '/about',
  keywords: ['about Orion eSolutions', 'technology company', 'IT company history'],
});

const values = [
  {
    icon: CheckCircle,
    title: 'Integrity First',
    description:
      'We are honest about what is achievable, transparent about challenges, and accountable for our commitments.',
  },
  {
    icon: Award,
    title: 'Excellence in Craft',
    description:
      'We take pride in the quality of our work — clean code, sound architecture, and solutions built to last.',
  },
  {
    icon: Globe2,
    title: 'Client-Centric Partnership',
    description:
      'We measure our success by our clients\' success. Every decision starts with the question: what is best for the client?',
  },
  {
    icon: Users,
    title: 'Inclusive Innovation',
    description:
      'We believe the best ideas come from diverse teams. We actively cultivate an inclusive environment where every voice is heard.',
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'About', url: `${SITE_CONFIG.url}/about` },
        ]}
      />

      <PageHero
        title="About Orion eSolutions"
        description="We are a technology partner for forward-thinking enterprises — combining deep technical expertise with a genuine commitment to your success."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Mission */}
      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">
                Our Mission
              </p>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Technology That Moves Business Forward
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-gray-600">
                Founded in 2012, Orion eSolutions was built on a simple premise: enterprises deserve technology partners who combine world-class engineering with genuine business acumen. Too often, technology firms deliver software without understanding — or caring about — the business outcomes it is meant to produce.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                We built Orion eSolutions differently. Every engagement starts with a deep understanding of your business goals. Every solution is designed to produce measurable outcomes. And our relationship doesn&apos;t end at go-live.
              </p>
              <ul className="space-y-3">
                {[
                  'Headquartered in San Francisco with global delivery capability',
                  'ISO 27001 certified and SOC 2 Type II compliant',
                  'Partnerships with AWS, Microsoft Azure, Google Cloud, and Salesforce',
                  'Active participant in open-source and technology communities',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-gray-700">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-secondary mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-1">
              <div className="rounded-xl bg-white p-8 space-y-6">
                {[
                  { year: '2012', event: 'Orion eSolutions founded in San Francisco' },
                  { year: '2015', event: 'Expanded cloud practice with AWS partnership' },
                  { year: '2018', event: 'Opened delivery centers in Europe and Asia-Pacific' },
                  { year: '2021', event: 'Launched AI & Data practice; surpassed 100 enterprise clients' },
                  { year: '2024', event: '200+ team members, 500+ projects delivered globally' },
                ].map((milestone, i) => (
                  <div key={milestone.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {milestone.year.slice(2)}
                      </div>
                      {i < 4 && <div className="mt-1 w-0.5 flex-1 bg-gray-100" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-gray-900">{milestone.year}</p>
                      <p className="text-sm text-gray-600">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Stats dark />

      {/* Values */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader
            eyebrow="What We Stand For"
            title="Our Core Values"
            description="These values guide every decision we make — from how we design solutions to how we engage with our clients and each other."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} padding="lg" className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Leadership */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Our People"
            title="Leadership Team"
            description="Experienced leaders who have built and transformed technology organizations at scale."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((member) => (
              <Card key={member.name} hover className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-700">
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="mb-3 text-sm font-medium text-secondary">{member.role}</p>
                <p className="text-xs leading-relaxed text-gray-600">{member.bio}</p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    LinkedIn →
                  </a>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Let&apos;s Build Something Great Together"
        description="We are always looking for new partnerships with organizations ready to leverage technology for growth."
        primaryCta={{ label: 'Start a Conversation', href: '/contact' }}
        secondaryCta={{ label: 'View Careers', href: '/careers' }}
      />
    </>
  );
}
