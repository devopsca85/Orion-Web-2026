import { Section } from '@/components/ui/Container';
import { stats as staticStats } from '@/lib/data/team';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { StatsDisplay } from './StatsDisplay';

interface StatsProps {
  className?: string;
  dark?: boolean;
}

export async function Stats({ className, dark = false }: StatsProps) {
  let items: { label: string; value: string }[] = [];
  try {
    const rows = await prisma.siteStat.findMany({ orderBy: { sortOrder: 'asc' } });
    if (rows.length > 0) items = rows.map((r) => ({ label: r.label, value: r.value }));
  } catch { /* fall back */ }

  if (items.length === 0) items = staticStats;

  return (
    <Section
      className={cn(
        '!py-0 overflow-hidden',
        dark
          ? 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700'
          : 'bg-white border-y border-indigo-100',
        className,
      )}
    >
      <StatsDisplay items={items} dark={dark} />
    </Section>
  );
}
