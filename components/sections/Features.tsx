import { CheckCircle, Clock, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: TrendingUp,
    title: 'Proven Delivery Track Record',
    description:
      '500+ projects delivered across 18 countries with a 98% client satisfaction rating. We set realistic timelines and consistently meet them.',
  },
  {
    icon: Users,
    title: 'Senior-Level Talent',
    description:
      'Every engagement is staffed with senior engineers and consultants who have 10+ years of industry experience. No bait-and-switch.',
  },
  {
    icon: Shield,
    title: 'Security-First Approach',
    description:
      'Security is built into every layer — from architecture reviews and code scanning to WAF configuration and penetration testing.',
  },
  {
    icon: Clock,
    title: 'Agile and Transparent',
    description:
      'Two-week sprints with regular demos and clear reporting. You always know what is being built, why, and what comes next.',
  },
  {
    icon: Zap,
    title: 'Accelerated Time to Market',
    description:
      'Pre-built accelerators and established CI/CD practices help our clients ship 3× faster than typical project timelines.',
  },
  {
    icon: CheckCircle,
    title: 'Post-Launch Partnership',
    description:
      'We do not disappear after go-live. Flexible support and managed services plans ensure your systems stay performant and secure.',
  },
];

interface FeaturesProps {
  className?: string;
}

export function Features({ className }: FeaturesProps) {
  return (
    <Section className={cn('bg-white', className)}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left — text */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">
              Why Orion Solutions
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              We Deliver Results, Not Just Deliverables
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Many technology firms promise transformation. We engineer it — with the expertise, processes, and accountability that turn ambitious goals into measurable business outcomes.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {features.slice(0, 4).map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-3">
                    <Icon className="h-6 w-6 flex-shrink-0 text-secondary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — remaining features + decorative element */}
          <div className="relative">
            <div className="rounded-2xl bg-primary p-8 text-white">
              <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-secondary">
                Our Commitment
              </p>
              <div className="space-y-6">
                {features.slice(4).map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        <p className="mt-1 text-sm text-white/70 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Trusted by leading enterprises</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                  {['Financial Services', 'Healthcare', 'Retail', 'Manufacturing', 'Government'].map((industry) => (
                    <span key={industry} className="rounded-full border border-white/20 px-2.5 py-1">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
