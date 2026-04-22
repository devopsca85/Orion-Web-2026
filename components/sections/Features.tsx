import { CheckCircle, Clock, Shield, TrendingUp, Users, Zap, Star, Lightbulb, Globe, Code2, BarChart2, Lock, Heart, Award, Target } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Users, Shield, Clock, Zap, CheckCircle,
  Star, Lightbulb, Globe, Code2, BarChart2, Lock, Heart, Award, Target,
}

const STATIC_FEATURES = [
  { id: -1, title: 'Proven Delivery Track Record', description: '500+ projects delivered across 18 countries with a 98% client satisfaction rating. We set realistic timelines and consistently meet them.', icon: 'TrendingUp', panel: 'left', active: true, sortOrder: 0 },
  { id: -2, title: 'Senior-Level Talent', description: 'Every engagement is staffed with senior engineers and consultants who have 10+ years of industry experience. No bait-and-switch.', icon: 'Users', panel: 'left', active: true, sortOrder: 1 },
  { id: -3, title: 'Security-First Approach', description: 'Security is built into every layer — from architecture reviews and code scanning to WAF configuration and penetration testing.', icon: 'Shield', panel: 'left', active: true, sortOrder: 2 },
  { id: -4, title: 'Agile and Transparent', description: 'Two-week sprints with regular demos and clear reporting. You always know what is being built, why, and what comes next.', icon: 'Clock', panel: 'left', active: true, sortOrder: 3 },
  { id: -5, title: 'Accelerated Time to Market', description: 'Pre-built accelerators and established CI/CD practices help our clients ship 3× faster than typical project timelines.', icon: 'Zap', panel: 'right', active: true, sortOrder: 4 },
  { id: -6, title: 'Post-Launch Partnership', description: 'We do not disappear after go-live. Flexible support and managed services plans ensure your systems stay performant and secure.', icon: 'CheckCircle', panel: 'right', active: true, sortOrder: 5 },
]

interface FeaturesProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export async function Features({
  className,
  eyebrow = 'Why Orion eSolutions',
  title = 'We Deliver Results, Not Just Deliverables',
  description = 'Many technology firms promise transformation. We engineer it — with the expertise, processes, and accountability that turn ambitious goals into measurable business outcomes.',
}: FeaturesProps) {
  let dbFeatures: typeof STATIC_FEATURES = []
  try {
    const rows = await prisma.siteFeature.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
    dbFeatures = rows.map(r => ({ ...r, panel: r.panel ?? 'left' }))
  } catch { /* fall back */ }

  const features = dbFeatures.length > 0 ? dbFeatures : STATIC_FEATURES
  const leftFeatures  = features.filter(f => f.panel === 'left')
  const rightFeatures = features.filter(f => f.panel === 'right')

  return (
    <Section className={cn('bg-white', className)}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left — text + features */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">{eyebrow}</p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">{description}</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {leftFeatures.map((feature) => {
                const Icon = iconMap[feature.icon] ?? CheckCircle
                return (
                  <div key={feature.id} className="flex gap-3">
                    <Icon className="h-6 w-6 flex-shrink-0 text-secondary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — blue commitment box */}
          <div className="relative">
            <div className="rounded-2xl bg-primary p-8 text-white">
              <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-secondary">Our Commitment</p>
              <div className="space-y-6">
                {rightFeatures.map((feature) => {
                  const Icon = iconMap[feature.icon] ?? CheckCircle
                  return (
                    <div key={feature.id} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        <p className="mt-1 text-sm text-white/70 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Trusted by leading enterprises</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                  {['Financial Services','Healthcare','Retail','Manufacturing','Government'].map(industry => (
                    <span key={industry} className="rounded-full border border-white/20 px-2.5 py-1">{industry}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
