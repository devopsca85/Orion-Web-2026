'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeroProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  bullets?: string[];
  variant?: 'home' | 'page';
}

export function Hero({
  eyebrow,
  title,
  highlight,
  description,
  primaryCta = { label: 'Get Started', href: '/contact' },
  secondaryCta,
  bullets,
  variant = 'home',
}: HeroProps) {
  const isHome = variant === 'home';

  return (
    <section
      className={cn(
        'relative flex items-center overflow-hidden bg-primary',
        isHome ? 'min-h-screen' : 'min-h-[420px] md:min-h-[520px]'
      )}
      aria-label="Hero"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary to-primary-800" />

      {/* Decorative orbs */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary-400/10 blur-3xl" />

      <Container className="relative z-10 py-20 md:py-28 lg:py-36">
        <div className={cn(isHome ? 'max-w-4xl' : 'max-w-3xl')}>
          {eyebrow && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {eyebrow}
            </div>
          )}

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {highlight ? (
              <>
                {title}{' '}
                <span className="text-secondary">{highlight}</span>
              </>
            ) : (
              title
            )}
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            {description}
          </p>

          {bullets && bullets.length > 0 && (
            <ul className="mb-8 space-y-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-secondary" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-4">
            <Button
              href={primaryCta.href}
              size="lg"
              variant="secondary"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} size="lg" variant="white">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent" />
    </section>
  );
}

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHero({ title, description, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-28">
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary to-primary-800" />
      <Container className="relative z-10">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-white/60">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-white/80">{description}</p>
        )}
      </Container>
    </section>
  );
}
