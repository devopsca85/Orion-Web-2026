import type { Metadata } from 'next';
import { HtmlSections } from '@/components/sections/HtmlSections';
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
import { getPageSections, type SectionConfig } from '@/lib/page-sections';

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
  const [settings, faqs, rawSections] = await Promise.all([
    getSettings([
      // Hero
      'home.hero.eyebrow', 'home.hero.title', 'home.hero.highlight', 'home.hero.description',
      'home.hero.primaryCtaLabel', 'home.hero.primaryCtaHref',
      'home.hero.secondaryCtaLabel', 'home.hero.secondaryCtaHref',
      'home.hero.bullet1', 'home.hero.bullet2', 'home.hero.bullet3',
      'home.hero.backgroundImage', 'home.hero.overlayOpacity', 'home.hero.height', 'home.hero.imagePosition',
      // Section headers
      'home.services.eyebrow', 'home.services.title', 'home.services.description',
      'home.portfolio.eyebrow', 'home.portfolio.title', 'home.portfolio.description',
      'home.blog.eyebrow', 'home.blog.title', 'home.blog.description',
      'home.features.eyebrow', 'home.features.title', 'home.features.description',
      // CTA
      'home.cta.title', 'home.cta.description',
      'home.cta.primaryLabel', 'home.cta.primaryHref',
      'home.cta.secondaryLabel', 'home.cta.secondaryHref',
    ]),
    getFAQs(),
    getPageSections('home'),
  ]);

  const bullets = [settings['home.hero.bullet1'], settings['home.hero.bullet2'], settings['home.hero.bullet3']].filter(Boolean) as string[];
  const visible = new Set(rawSections.filter((s: SectionConfig) => s.visible).map((s: SectionConfig) => s.key));
  const orderedKeys = rawSections.map((s: SectionConfig) => s.key);

  const sectionMap = {
    'hero': visible.has('hero') ? <Hero
      eyebrow={settings['home.hero.eyebrow'] || 'Enterprise Technology Partner'}
      title={settings['home.hero.title'] || 'Transforming Business Through'}
      highlight={settings['home.hero.highlight'] || 'Technology'}
      description={settings['home.hero.description'] || 'Orion eSolutions delivers innovative software development, cloud solutions, IT consulting, and digital transformation services to enterprises worldwide.'}
      primaryCta={{ label: settings['home.hero.primaryCtaLabel'] || 'Get a Free Consultation', href: settings['home.hero.primaryCtaHref'] || '/contact' }}
      secondaryCta={{ label: settings['home.hero.secondaryCtaLabel'] || 'View Our Work', href: settings['home.hero.secondaryCtaHref'] || '/portfolio' }}
      bullets={bullets.length > 0 ? bullets : ['150+ enterprise clients across 18 countries', '500+ projects delivered on time and on budget', '98% client satisfaction rating']}
      backgroundImage={settings['home.hero.backgroundImage'] || undefined}
      overlayOpacity={settings['home.hero.overlayOpacity'] || '0.65'}
      height={settings['home.hero.height'] || undefined}
      imagePosition={settings['home.hero.imagePosition'] || 'center center'}
    /> : null,

    'client-logos': visible.has('client-logos') ? <ClientLogos /> : null,
    'stats':         visible.has('stats')        ? <Stats /> : null,

    'services-grid': visible.has('services-grid') ? <ServicesGrid
      limit={6} showCta
      eyebrow={settings['home.services.eyebrow'] || undefined}
      title={settings['home.services.title'] || undefined}
      description={settings['home.services.description'] || undefined}
    /> : null,

    'features': visible.has('features') ? <Features
      eyebrow={settings['home.features.eyebrow'] || undefined}
      title={settings['home.features.title'] || undefined}
      description={settings['home.features.description'] || undefined}
    /> : null,

    'tech-stack':        visible.has('tech-stack')        ? <TechStackGrid /> : null,
    'engagement-models': visible.has('engagement-models') ? <EngagementModels /> : null,

    'portfolio': visible.has('portfolio') ? <PortfolioGrid
      eyebrow={settings['home.portfolio.eyebrow'] || undefined}
      title={settings['home.portfolio.title'] || undefined}
      description={settings['home.portfolio.description'] || undefined}
    /> : null,

    'testimonials': visible.has('testimonials') ? <Testimonials /> : null,
    'awards':       visible.has('awards')       ? <AwardsSection /> : null,
    'faq':          visible.has('faq')          ? <FAQSection faqs={faqs} /> : null,

    'blog': visible.has('blog') ? <BlogGrid
      limit={3}
      eyebrow={settings['home.blog.eyebrow'] || undefined}
      title={settings['home.blog.title'] || undefined}
      description={settings['home.blog.description'] || undefined}
    /> : null,

    'cta': visible.has('cta') ? <CTA
      title={settings['home.cta.title'] || 'Ready to Transform Your Business?'}
      description={settings['home.cta.description'] || 'Book a free 30-minute consultation with one of our technology experts. No commitment required.'}
      primaryCta={{ label: settings['home.cta.primaryLabel'] || 'Book a Free Consultation', href: settings['home.cta.primaryHref'] || '/contact' }}
      secondaryCta={settings['home.cta.secondaryLabel'] ? { label: settings['home.cta.secondaryLabel'], href: settings['home.cta.secondaryHref'] || '/portfolio' } : { label: 'View Case Studies', href: '/portfolio' }}
    /> : null,
  };

  return (
    <>
      {orderedKeys.map((key: string) => {
        const node = sectionMap[key as keyof typeof sectionMap];
        return node ? <div key={key}>{node}</div> : null;
      })}
      <HtmlSections pageSlug="home" />
    </>
  );
}
