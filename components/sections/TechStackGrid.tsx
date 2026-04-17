import { prisma } from '@/lib/prisma';
import { Container, Section, SectionHeader } from '@/components/ui/Container';

const fallback = [
  { category: 'Frontend', items: [
    { id: '1', name: 'React', logoUrl: 'https://cdn.simpleicons.org/react' },
    { id: '2', name: 'Next.js', logoUrl: 'https://cdn.simpleicons.org/nextdotjs' },
    { id: '3', name: 'TypeScript', logoUrl: 'https://cdn.simpleicons.org/typescript' },
  ]},
  { category: 'Backend', items: [
    { id: '4', name: 'Node.js', logoUrl: 'https://cdn.simpleicons.org/nodedotjs' },
    { id: '5', name: 'Python', logoUrl: 'https://cdn.simpleicons.org/python' },
    { id: '6', name: 'Java', logoUrl: 'https://cdn.simpleicons.org/openjdk' },
  ]},
  { category: 'Cloud', items: [
    { id: '7', name: 'AWS', logoUrl: 'https://cdn.simpleicons.org/amazonaws' },
    { id: '8', name: 'Azure', logoUrl: 'https://cdn.simpleicons.org/microsoftazure' },
    { id: '9', name: 'GCP', logoUrl: 'https://cdn.simpleicons.org/googlecloud' },
  ]},
];

async function getGrouped() {
  try {
    const rows = await prisma.techStack.findMany({
      where: { active: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      select: { id: true, name: true, logoUrl: true, category: true },
    });
    if (rows.length === 0) return fallback;
    const map = new Map<string, typeof rows>();
    for (const r of rows) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return [...map.entries()].map(([category, items]) => ({ category, items }));
  } catch {
    return fallback;
  }
}

export async function TechStackGrid() {
  const groups = await getGrouped();

  return (
    <Section className="bg-white">
      <Container>
        <SectionHeader
          eyebrow="Our Expertise"
          title="Technologies We Work With"
          description="We stay at the forefront of technology to deliver modern, scalable, and future-proof solutions."
        />

        <div className="space-y-10">
          {groups.map(({ category, items }) => (
            <div key={category}>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-500">{category}</h3>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-primary/20 hover:bg-primary-50/30 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logoUrl} alt={item.name} className="h-8 w-8 object-contain" />
                    <span className="text-xs font-medium text-gray-600 text-center leading-tight">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
