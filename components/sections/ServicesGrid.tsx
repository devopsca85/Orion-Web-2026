import Link from 'next/link';
import {
  Code2,
  Cloud,
  Lightbulb,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card, CardIcon } from '@/components/ui/Card';
import { services } from '@/lib/data/services';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Cloud,
  Lightbulb,
  Zap,
  Shield,
  BarChart3,
};

interface ServicesGridProps {
  limit?: number;
  showCta?: boolean;
  className?: string;
}

export function ServicesGrid({ limit, showCta = true, className }: ServicesGridProps) {
  const displayedServices = limit ? services.slice(0, limit) : services;

  return (
    <Section className={cn('bg-gray-50', className)}>
      <Container>
        <SectionHeader
          eyebrow="What We Do"
          title="End-to-End Technology Services"
          description="From strategy to implementation, we deliver comprehensive technology solutions that help enterprises innovate faster and operate smarter."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedServices.map((service) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <Link key={service.slug} href={`/services/${service.slug}`} className="group block">
                <Card hover padding="lg" className="h-full">
                  <CardIcon
                    icon={<Icon className="h-6 w-6" />}
                    className="group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                  />
                  <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {showCta && (
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-700 transition-colors"
            >
              View all services <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
