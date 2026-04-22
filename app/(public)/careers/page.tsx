import type { Metadata } from 'next';
import { Heart, Zap, Globe2, Award, DollarSign, GraduationCap } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata: Metadata = genMeta({
  title: 'Careers',
  description:
    'Join the Orion eSolutions team. We are hiring engineers, consultants, and architects who want to solve complex technology challenges for enterprise clients worldwide.',
  path: '/careers',
  keywords: ['IT jobs', 'software engineering jobs', 'technology careers', 'Orion eSolutions hiring'],
});

const benefits = [
  { icon: DollarSign, title: 'Competitive Compensation', description: 'Top-of-market salaries, equity participation, and performance bonuses.' },
  { icon: Heart, title: 'Comprehensive Health', description: 'Full medical, dental, and vision coverage for you and your family.' },
  { icon: Globe2, title: 'Remote-First', description: 'Work from anywhere. We have team members across 12 time zones.' },
  { icon: GraduationCap, title: 'Learning & Development', description: '$3,000/year learning budget, certifications covered, and weekly tech talks.' },
  { icon: Zap, title: 'Impactful Work', description: 'Solve real technology challenges for enterprises across industries.' },
  { icon: Award, title: 'Recognition Programs', description: 'Peer recognition, annual awards, and career advancement pathways.' },
];

export default async function CareersPage() {
  let openings: { id: string; title: string; department: string; location: string; type: string; level: string }[] = [];
  try {
    openings = await prisma.jobOpening.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, title: true, department: true, location: true, type: true, level: true },
    });
  } catch {
    // DB not yet migrated — fall back to empty list
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Careers', url: `${SITE_CONFIG.url}/careers` },
        ]}
      />

      <PageHero
        title="Build Your Career at Orion eSolutions"
        description="Join a team of world-class engineers and consultants solving complex technology challenges for leading enterprises. We are growing fast and want you to grow with us."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
      />

      {/* Benefits */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Life at Orion"
            title="Why People Love Working Here"
            description="We invest in our people because we know that great outcomes come from teams that are supported, challenged, and valued."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} padding="lg">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Open roles */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader
            eyebrow="Open Positions"
            title="Current Opportunities"
            description="We are always looking for talented people. Don't see the perfect role? Send us your resume anyway."
          />
          {openings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">No open positions right now</p>
              <p className="text-sm">Check back soon or send a general application below.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openings.map((role) => (
                <div
                  key={role.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="primary">{role.department}</Badge>
                      <Badge variant="default">{role.location}</Badge>
                      <Badge variant="default">{role.level}</Badge>
                      <Badge variant="success">{role.type}</Badge>
                    </div>
                  </div>
                  <Link
                    href={`/careers/${role.id}`}
                    className="flex-shrink-0 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    View & Apply
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <CTA
        title="Don't See Your Role?"
        description="We are always interested in hearing from talented people. Send us your resume and tell us what you do best."
        primaryCta={{ label: 'Send Your Resume', href: `mailto:${SITE_CONFIG.email}?subject=General Application` }}
        variant="primary"
      />
    </>
  );
}
