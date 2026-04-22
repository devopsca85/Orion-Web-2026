import Link from 'next/link';
import {
  Code2, Cloud, Lightbulb, Zap, Shield, BarChart3, ArrowRight,
  Settings, Database, Globe, Cpu, Lock, Brain, Layers, Smartphone,
} from 'lucide-react';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Cloud, Lightbulb, Zap, Shield, BarChart3, Settings,
  Database, Globe, Cpu, Lock, Brain, Layers, Smartphone,
};

interface ServiceItem {
  slug: string;
  title: string;
  shortDesc: string;
  icon: string;
  heroImageUrl: string | null;
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = iconMap[service.icon] || Code2;
  const hasImage = !!service.heroImageUrl;

  return (
    <Link href={`/services/${service.slug}`} className="group block h-full">
      <div className="h-full rounded-2xl border border-gray-100 bg-white shadow-soft overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/20">
        {/* Image area */}
        {hasImage ? (
          <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.heroImageUrl!}
              alt={service.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Icon badge over image */}
            <div className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md text-primary">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        ) : (
          /* No image — gradient placeholder with centred icon */
          <div className="relative h-36 flex items-center justify-center bg-gradient-to-br from-primary/8 to-secondary/8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Icon className="h-7 w-7" />
            </div>
          </div>
        )}

        {/* Text content */}
        <div className="p-5">
          <h3 className="mb-2 text-base font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
            {service.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-3">
            {service.shortDesc}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Learn more <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ServicesGridProps {
  limit?: number;
  showCta?: boolean;
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export async function ServicesGrid({
  limit,
  showCta = true,
  className,
  eyebrow = 'What We Do',
  title = 'End-to-End Technology Services',
  description = 'From strategy to implementation, we deliver comprehensive technology solutions that help enterprises innovate faster and operate smarter.',
}: ServicesGridProps) {
  let services: ServiceItem[] = [];
  try {
    services = await prisma.service.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      select: { slug: true, title: true, shortDesc: true, icon: true, heroImageUrl: true },
    });
    if (limit) services = services.slice(0, limit);
  } catch { /* DB unavailable */ }

  return (
    <Section className={cn('bg-gray-50', className)}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />

        {services.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-12">
            No services published yet. Add services in the admin panel.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        )}

        {showCta && services.length > 0 && (
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
