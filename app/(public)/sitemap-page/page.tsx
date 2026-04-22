import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui/Container';
import { generateMetadata as genMeta } from '@/lib/seo';
import { services } from '@/lib/data/services';
import { industries } from '@/lib/data/industries';
import { blogPosts } from '@/lib/data/blog';
import { portfolioItems } from '@/lib/data/portfolio';
import { resources } from '@/lib/data/resources';

export const metadata: Metadata = genMeta({
  title: 'Sitemap',
  description: 'A complete list of all pages on the Orion eSolutions website.',
  path: '/sitemap-page',
});

interface SitemapSection {
  title: string;
  links: { label: string; href: string }[];
}

export default function SitemapPage() {
  const sections: SitemapSection[] = [
    {
      title: 'Main Pages',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Portfolio / Case Studies', href: '/portfolio' },
        { label: 'Blog & Insights', href: '/blog' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Partners & Certifications', href: '/partners' },
        { label: 'Resources', href: '/resources' },
      ],
    },
    {
      title: 'About Us',
      links: [
        { label: 'About Orion eSolutions', href: '/about' },
        { label: 'Our Culture', href: '/about/culture' },
        { label: 'Certifications & Compliance', href: '/about/certifications' },
        { label: 'Corporate Responsibility (CSR)', href: '/about/csr' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'All Services', href: '/services' },
        ...services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
      ],
    },
    {
      title: 'Industries',
      links: [
        { label: 'All Industries', href: '/industries' },
        ...industries.map((i) => ({ label: i.title, href: `/industries/${i.slug}` })),
      ],
    },
    {
      title: 'Portfolio',
      links: [
        { label: 'All Case Studies', href: '/portfolio' },
        ...portfolioItems.map((p) => ({ label: p.title, href: `/portfolio/${p.slug}` })),
      ],
    },
    {
      title: 'Blog',
      links: [
        { label: 'All Articles', href: '/blog' },
        ...blogPosts.map((p) => ({ label: p.title, href: `/blog/${p.slug}` })),
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'All Resources', href: '/resources' },
        ...resources.map((r) => ({ label: r.title, href: `/resources/${r.slug}` })),
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
        { label: 'Cookie Policy', href: '/cookie-policy' },
      ],
    },
  ];

  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-12">
        <Container size="md">
          <h1 className="text-4xl font-bold text-gray-900">Sitemap</h1>
          <p className="mt-2 text-gray-500">A complete list of all pages on the Orion eSolutions website.</p>
        </Container>
      </div>
      <Section>
        <Container size="md">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-700 hover:text-primary hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
