import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ClientLogos } from '@/components/sections/ClientLogos';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { TechStackGrid } from '@/components/sections/TechStackGrid';
import { EngagementModels } from '@/components/sections/EngagementModels';
import { AwardsSection } from '@/components/sections/AwardsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { PortfolioGrid } from '@/components/sections/PortfolioGrid';
import { BlogGrid } from '@/components/sections/BlogGrid';
import { CTA } from '@/components/sections/CTA';
import { generateMetadata as genMeta } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = genMeta({
  path: '/',
  keywords: ['technology solutions', 'enterprise IT', 'digital transformation'],
});

async function getFAQs() {
  try {
    return await prisma.fAQ.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }],
      select: { id: true, question: true, answer: true, category: true },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [settings, faqs] = await Promise.all([
    getSettings([
      'home.hero.eyebrow',
      'home.hero.title',
      'home.hero.highlight',
      'home.hero.description',
      'home.hero.primaryCtaLabel',
      'home.hero.primaryCtaHref',
      'home.hero.secondaryCtaLabel',
      'home.hero.secondaryCtaHref',
      'home.hero.bullet1',
      'home.hero.bullet2',
      'home.hero.bullet3',
      'home.hero.backgroundImage',
      'home.hero.overlayOpacity',
    ]),
    getFAQs(),
  ]);

  const bullets = [
    settings['home.hero.bullet1'],
    settings['home.hero.bullet2'],
    settings['home.hero.bullet3'],
  ].filter(Boolean) as string[];

  return (
    <>
      <Hero
        eyebrow={settings['home.hero.eyebrow'] || 'Enterprise Technology Partner'}
        title={settings['home.hero.title'] || 'Transforming Business Through'}
        highlight={settings['home.hero.highlight'] || 'Technology'}
        description={settings['home.hero.description'] || 'Orion eSolutions delivers innovative software development, cloud solutions, IT consulting, and digital transformation services to enterprises worldwide.'}
        primaryCta={{
          label: settings['home.hero.primaryCtaLabel'] || 'Get a Free Consultation',
          href: settings['home.hero.primaryCtaHref'] || '/contact',
        }}
        secondaryCta={{
          label: settings['home.hero.secondaryCtaLabel'] || 'View Our Work',
          href: settings['home.hero.secondaryCtaHref'] || '/portfolio',
        }}
        bullets={bullets.length > 0 ? bullets : [
          '150+ enterprise clients across 18 countries',
          '500+ projects delivered on time and on budget',
          '98% client satisfaction rating',
        ]}
        backgroundImage={settings['home.hero.backgroundImage'] || undefined}
        overlayOpacity={settings['home.hero.overlayOpacity'] || '0.65'}
      />
      <ClientLogos />
      <Stats />
      <ServicesGrid limit={6} showCta />
      <Features />
      <TechStackGrid />
      <EngagementModels />
      <PortfolioGrid />
      <Testimonials />
      <AwardsSection />
      <FAQSection faqs={faqs} />
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
