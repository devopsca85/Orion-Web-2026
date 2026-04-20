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
import { getPageSections } from '@/lib/page-sections';

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
    getPageSections('home'),
  ]);

  const bullets = [
    settings['home.hero.bullet1'],
    settings['home.hero.bullet2'],
    settings['home.hero.bullet3'],
  ].filter(Boolean) as string[];

  // Build ordered map: key → visible
  const visible = new Set(rawSections.filter((s) => s.visible).map((s) => s.key))
  const orderedKeys = rawSections.map((s) => s.key)

  const heroProps = {
    eyebrow: settings['home.hero.eyebrow'] || 'Enterprise Technology Partner',
    title: settings['home.hero.title'] || 'Transforming Business Through',
    highlight: settings['home.hero.highlight'] || 'Technology',
    description: settings['home.hero.description'] || 'Orion eSolutions delivers innovative software development, cloud solutions, IT consulting, and digital transformation services to enterprises worldwide.',
    primaryCta: {
      label: settings['home.hero.primaryCtaLabel'] || 'Get a Free Consultation',
      href: settings['home.hero.primaryCtaHref'] || '/contact',
    },
    secondaryCta: {
      label: settings['home.hero.secondaryCtaLabel'] || 'View Our Work',
      href: settings['home.hero.secondaryCtaHref'] || '/portfolio',
    },
    bullets: bullets.length > 0 ? bullets : [
      '150+ enterprise clients across 18 countries',
      '500+ projects delivered on time and on budget',
      '98% client satisfaction rating',
    ],
    backgroundImage: settings['home.hero.backgroundImage'] || undefined,
    overlayOpacity: settings['home.hero.overlayOpacity'] || '0.65',
  }

  const sectionMap = {
    'hero':               visible.has('hero')               ? <Hero {...heroProps} />                   : null,
    'client-logos':       visible.has('client-logos')       ? <ClientLogos />                           : null,
    'stats':              visible.has('stats')              ? <Stats />                                 : null,
    'services-grid':      visible.has('services-grid')      ? <ServicesGrid limit={6} showCta />        : null,
    'features':           visible.has('features')           ? <Features />                              : null,
    'tech-stack':         visible.has('tech-stack')         ? <TechStackGrid />                         : null,
    'engagement-models':  visible.has('engagement-models')  ? <EngagementModels />                      : null,
    'portfolio':          visible.has('portfolio')          ? <PortfolioGrid />                         : null,
    'testimonials':       visible.has('testimonials')       ? <Testimonials />                          : null,
    'awards':             visible.has('awards')             ? <AwardsSection />                         : null,
    'faq':                visible.has('faq')                ? <FAQSection faqs={faqs} />                : null,
    'blog':               visible.has('blog')               ? <BlogGrid limit={3} />                    : null,
    'cta':                visible.has('cta')                ? (
      <CTA
        title="Ready to Transform Your Business?"
        description="Book a free 30-minute consultation with one of our technology experts. No commitment required."
        primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
        secondaryCta={{ label: 'View Case Studies', href: '/portfolio' }}
      />
    ) : null,
  }

  return (
    <>
      {orderedKeys.map((key: string) => {
        const node = sectionMap[key as keyof typeof sectionMap]
        return node ? <div key={key}>{node}</div> : null
      })}
    </>
  );
}
