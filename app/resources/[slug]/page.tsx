import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Play, Lock } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { resources } from '@/lib/data/resources';
import { generateMetadata as genMeta } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) return {};
  return genMeta({
    title: resource.title,
    description: resource.excerpt,
    path: `/resources/${slug}`,
    keywords: [resource.topic, resource.type, 'free download'],
  });
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) notFound();

  const related = resources.filter((r) => r.slug !== slug && r.topic === resource.topic).slice(0, 2);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Resources', url: `${SITE_CONFIG.url}/resources` },
        { name: resource.title, url: `${SITE_CONFIG.url}/resources/${slug}` },
      ]} />

      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary to-primary-800" />
        <Container size="md" className="relative z-10">
          <Link href="/resources" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </Link>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge className="bg-secondary text-white capitalize">{resource.type}</Badge>
            <Badge className="border border-white/20 bg-white/10 text-white">{resource.topic}</Badge>
            {resource.gated && <Badge className="border border-white/20 bg-white/10 text-white"><Lock className="mr-1 h-3 w-3 inline" />Free Download</Badge>}
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{resource.title}</h1>
          <p className="text-white/70 text-sm">{formatDate(resource.publishedAt)}</p>
        </Container>
      </section>

      <Section className="bg-gray-50">
        <Container size="md">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Description */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-soft">
                <h2 className="mb-4 text-xl font-bold text-gray-900">About This Resource</h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-600">{resource.excerpt}</p>
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">What you&apos;ll learn:</p>
                  <ul className="space-y-2">
                    {['Practical frameworks and actionable steps', 'Real-world examples from enterprise deployments', 'Expert analysis from Orion Solutions practitioners', 'Tools, checklists, and templates included'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {related.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 font-bold text-gray-900">Related Resources</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/resources/${r.slug}`} className="group block rounded-xl border border-gray-100 bg-white p-5 hover:border-primary/30 transition-colors">
                        <Badge variant="primary" className="mb-2 capitalize">{r.type}</Badge>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">{r.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Download / Watch form */}
            <aside>
              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                {resource.gated ? (
                  <>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                      <Download className="h-6 w-6" />
                    </div>
                    <h3 className="mb-1 font-bold text-gray-900">Download Free</h3>
                    <p className="mb-4 text-sm text-gray-500">Enter your details to access this resource instantly.</p>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                      <input required type="text" placeholder="Full Name" className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                      <input required type="email" placeholder="Work Email" className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                      <input type="text" placeholder="Company (optional)" className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary-600 transition-colors">
                        <Download className="h-4 w-4" /> Download Now — Free
                      </button>
                    </form>
                    <p className="mt-3 text-xs text-gray-400">No spam. Unsubscribe anytime. See our <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white">
                      <Play className="h-6 w-6" />
                    </div>
                    <h3 className="mb-1 font-bold text-gray-900">Watch On-Demand</h3>
                    <p className="mb-4 text-sm text-gray-500">This webinar is available to watch immediately — no registration required.</p>
                    <a href={resource.watchUrl || '#'} className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary-600 transition-colors">
                      <Play className="h-4 w-4" /> Watch Now
                    </a>
                  </>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CTA
        title="Want Expert Guidance on This Topic?"
        description="Our consultants can walk you through applying these insights to your specific situation."
        primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
        variant="light"
      />
    </>
  );
}
