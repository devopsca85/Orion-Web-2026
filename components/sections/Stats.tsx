import { Container, Section } from '@/components/ui/Container';
import { stats } from '@/lib/data/team';
import { cn } from '@/lib/utils';

interface StatsProps {
  className?: string;
  dark?: boolean;
}

export function Stats({ className, dark = false }: StatsProps) {
  return (
    <Section
      className={cn(
        dark ? 'bg-primary text-white' : 'bg-white',
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={cn(
                  'text-3xl font-extrabold md:text-4xl',
                  dark ? 'text-secondary' : 'text-primary'
                )}
              >
                {stat.value}
              </p>
              <p
                className={cn(
                  'mt-1 text-sm font-medium',
                  dark ? 'text-white/70' : 'text-gray-500'
                )}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
