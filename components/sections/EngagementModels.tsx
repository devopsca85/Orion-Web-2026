import { prisma } from '@/lib/prisma';
import { Container, Section } from '@/components/ui/Container';
import { CheckCircle } from 'lucide-react';

const fallback = [
  {
    id: '1',
    title: 'Fixed Price',
    description: 'Best for well-defined projects with clear scope and requirements.',
    features: ['Clear budget & timeline', 'Milestone-based delivery', 'Ideal for fixed scope', 'Full cost predictability'],
  },
  {
    id: '2',
    title: 'Time & Material',
    description: 'Flexible engagement for evolving requirements and dynamic projects.',
    features: ['Pay for actual work done', 'Scope flexibility', 'Iterative delivery', 'Transparent billing'],
  },
  {
    id: '3',
    title: 'Dedicated Team',
    description: 'Your own extended engineering team, fully integrated with your processes.',
    features: ['Full-time dedicated resources', 'Direct team communication', 'Scales up or down easily', 'Long-term partnership'],
  },
];

async function getModels() {
  try {
    const rows = await prisma.engagementModel.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }],
      select: { id: true, title: true, description: true, features: true },
    });
    return rows.length > 0
      ? rows.map((r) => ({ ...r, features: Array.isArray(r.features) ? (r.features as string[]) : [] }))
      : fallback;
  } catch {
    return fallback;
  }
}

export async function EngagementModels() {
  const models = await getModels();

  return (
    <Section className="bg-primary">
      <Container>
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">How We Work</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Engagement Models</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/70">
            Choose the collaboration model that best fits your project needs and business goals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {models.map((model, i) => (
            <div
              key={model.id}
              className={`rounded-2xl p-8 ${i === 1 ? 'bg-secondary text-white' : 'bg-white/10 text-white border border-white/20'}`}
            >
              <h3 className="mb-3 text-xl font-bold">{model.title}</h3>
              <p className={`mb-6 text-sm leading-relaxed ${i === 1 ? 'text-white/80' : 'text-white/70'}`}>
                {model.description}
              </p>
              <ul className="space-y-2.5">
                {model.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${i === 1 ? 'text-white' : 'text-secondary'}`} />
                    <span className={i === 1 ? 'text-white/90' : 'text-white/80'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
