import type { Metadata } from 'next';
import { Heart, Users, Globe2, Lightbulb, Award, Coffee } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Our Culture',
  description: 'What it is like to work at Orion eSolutions — our values, team culture, inclusion initiatives, and what makes us a place where great technologists thrive.',
  path: '/about/culture',
});

const pillars = [
  { icon: Lightbulb, title: 'Curiosity Over Comfort', description: 'We hire people who are never satisfied with the status quo. Every team member is encouraged to ask hard questions, propose bolder approaches, and challenge assumptions — including our own.' },
  { icon: Users, title: 'Collaboration Without Ego', description: 'The best ideas come from teams, not individuals. We have deliberately built a culture where credit is shared, expertise is taught, and no one is too senior to ask for help.' },
  { icon: Heart, title: 'Empathy as a Technical Skill', description: "We believe empathy makes engineers better. Understanding a client's real problem — not just the stated requirement — is what separates good solutions from great ones." },
  { icon: Globe2, title: 'Inclusion by Design', description: 'Our team spans 18 countries and we actively recruit from underrepresented groups. We track inclusion metrics the same way we track technical KPIs — because it matters that much.' },
  { icon: Award, title: 'Excellence Without Burnout', description: 'We set high standards but protect sustainable pace. We do not reward heroics that mask poor planning. Great work done by energized, healthy people is what we are after.' },
  { icon: Coffee, title: 'Human First, Always', description: 'Life happens. We offer flexible hours, unlimited PTO, generous parental leave, and mental health support because we know our team performs best when they feel genuinely supported.' },
];

const benefits = [
  { category: 'Health & Wellbeing', items: ['Full medical, dental, and vision for you and family', 'Mental health support via EAP and coaching', '$500/yr wellness stipend', 'Flexible working hours'] },
  { category: 'Growth & Learning', items: ['$3,000/yr learning budget', 'All certifications covered', 'Weekly internal tech talks', 'Conference attendance and speaking support'] },
  { category: 'Work Flexibility', items: ['Remote-first (18 countries)', 'Async-first communication culture', 'Home office stipend — $1,000 setup + $75/month', '4-day work week pilot for senior staff'] },
  { category: 'Financial', items: ['Top-of-market base salary', 'Equity participation program', 'Performance bonuses', '401(k) with 4% company match'] },
];

export default function CulturePage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'About', url: `${SITE_CONFIG.url}/about` },
        { name: 'Culture', url: `${SITE_CONFIG.url}/about/culture` },
      ]} />

      <PageHero
        title="Our Culture"
        description="We believe culture is not a perk — it is the foundation of everything we build. Here is what working at Orion eSolutions actually looks like."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Culture' }]}
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader eyebrow="What We Believe" title="Six Principles That Define How We Work" description="These are not aspirational values painted on a wall — they shape how we hire, how we make decisions, and how we treat each other." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title} padding="lg">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{pillar.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container>
          <SectionHeader eyebrow="Benefits" title="How We Take Care of Our Team" description="Competitive benefits are table stakes. Here is what we offer on top of that." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((group) => (
              <div key={group.category} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                <h3 className="mb-4 font-bold text-gray-900 text-sm uppercase tracking-wide">{group.category}</h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Sound Like Your Kind of Place?"
        description="We are always hiring talented people who share our values. Explore open roles."
        primaryCta={{ label: 'View Open Roles', href: '/careers' }}
        secondaryCta={{ label: 'Learn About the Team', href: '/about' }}
      />
    </>
  );
}
