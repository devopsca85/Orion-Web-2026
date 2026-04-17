import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { PortfolioGrid } from '@/components/sections/PortfolioGrid';
import { BlogGrid } from '@/components/sections/BlogGrid';
import { CTA } from '@/components/sections/CTA';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata: Metadata = genMeta({
  path: '/',
  keywords: ['technology solutions', 'enterprise IT', 'digital transformation'],
});

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Enterprise Technology Partner"
        title="Transforming Business Through"
        highlight="Technology"
        description="Orion Solutions delivers innovative software development, cloud solutions, IT consulting, and digital transformation services to enterprises worldwide. We turn complex technology challenges into competitive advantages."
        primaryCta={{ label: 'Get a Free Consultation', href: '/contact' }}
        secondaryCta={{ label: 'View Our Work', href: '/portfolio' }}
        bullets={[
          '150+ enterprise clients across 18 countries',
          '500+ projects delivered on time and on budget',
          '98% client satisfaction rating',
        ]}
      />
      <Stats />
      <ServicesGrid limit={6} showCta />
      <Features />
      <PortfolioGrid />
      <Testimonials />
      <BlogGrid limit={3} />
      <CTA
        title="Ready to Transform Your Business?"
        description="Book a free 30-minute consultation with one of our technology experts. No commitment required."
        primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
        secondaryCta={{ label: 'View Case Studies', href: '/portfolio' }}
      />
    </>
  );
}
