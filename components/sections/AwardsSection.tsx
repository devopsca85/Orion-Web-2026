import { prisma } from '@/lib/prisma';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Trophy } from 'lucide-react';

async function getAwards() {
  try {
    const rows = await prisma.award.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }],
      select: { id: true, title: true, issuer: true, year: true, logoUrl: true, description: true },
    });
    return rows;
  } catch {
    return [];
  }
}

export async function AwardsSection() {
  const awards = await getAwards();
  if (awards.length === 0) return null;

  return (
    <Section className="bg-gray-50">
      <Container>
        <SectionHeader
          eyebrow="Recognition"
          title="Awards & Recognitions"
          description="Industry recognition for delivering exceptional technology solutions and client outcomes."
        />

        <div className="flex flex-wrap justify-center gap-5">
          {awards.map((award) => (
            <div
              key={award.id}
              className="flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow w-52 flex-shrink-0"
            >
              {award.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={award.logoUrl} alt={award.title} className="mb-4 h-16 w-auto object-contain" />
              ) : (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                  <Trophy className="h-7 w-7 text-amber-500" />
                </div>
              )}
              <p className="text-xs font-medium text-gray-400 mb-1">
                {[award.issuer, award.year].filter(Boolean).join(' · ')}
              </p>
              <h3 className="text-sm font-semibold text-gray-900 leading-snug">{award.title}</h3>
              {award.description && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{award.description}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
