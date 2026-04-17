import { ArrowRight, Calendar } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface CTAProps {
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: 'primary' | 'secondary' | 'light';
}

export function CTA({
  title = 'Ready to Transform Your Business?',
  description = 'Talk to one of our technology experts and discover how Orion Solutions can help you achieve your goals faster.',
  primaryCta = { label: 'Get a Free Consultation', href: '/contact' },
  secondaryCta,
  variant = 'primary',
}: CTAProps) {
  const isDark = variant === 'primary' || variant === 'secondary';

  return (
    <Section
      className={
        variant === 'primary'
          ? 'bg-primary text-white'
          : variant === 'secondary'
          ? 'bg-secondary text-white'
          : 'bg-white border-y border-gray-100'
      }
    >
      <Container size="md">
        <div className="text-center">
          <h2
            className={`mb-4 text-3xl font-bold tracking-tight sm:text-4xl ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h2>
          <p className={`mb-8 text-lg ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
            {description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href={primaryCta.href}
              size="lg"
              variant={isDark ? 'white' : 'primary'}
              icon={<ArrowRight className="h-5 w-5" />}
            >
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button
                href={secondaryCta.href}
                size="lg"
                variant={isDark ? 'outline' : 'outline'}
                className={isDark ? 'border-white text-white hover:bg-white hover:text-primary' : ''}
                icon={<Calendar className="h-5 w-5" />}
                iconPosition="left"
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
