import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd';
import { blogPosts, getPostBySlug } from '@/lib/data/blog';
import { generateMetadata as genMeta } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return genMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  const postUrl = `${SITE_CONFIG.url}/blog/${slug}`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Blog', url: `${SITE_CONFIG.url}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        url={postUrl}
        publishedAt={post.publishedAt}
        authorName={post.author.name}
      />

      {/* Article hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary to-primary-800" />
        <Container size="md" className="relative z-10">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <Badge className="mb-4 bg-secondary text-white">{post.category}</Badge>
          <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </span>
          </div>
        </Container>
      </section>

      <Section className="bg-white">
        <Container size="md">
          <div className="grid gap-12 lg:grid-cols-4">
            {/* Article body */}
            <article className="lg:col-span-3">
              {/* Author */}
              <div className="mb-8 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.role} at {SITE_CONFIG.name}</p>
                </div>
              </div>

              {/* Excerpt as intro */}
              <div className="mb-8 rounded-xl border-l-4 border-secondary bg-secondary/5 p-5">
                <p className="text-lg font-medium leading-relaxed text-gray-700 italic">
                  {post.excerpt}
                </p>
              </div>

              {/* Placeholder article body — replace with CMS content */}
              <div className="prose prose-lg prose-gray max-w-none">
                <p>
                  This article is published via our CMS. When Sanity is connected, the full article body will render here. The excerpt above provides a summary of the key insights covered in this piece.
                </p>
                <p>
                  Our team of experts regularly publishes deep-dive content on technology trends, implementation guides, and lessons learned from real client engagements. Subscribe to our newsletter to be notified when new content is published.
                </p>
                <h2>Key Takeaways</h2>
                <ul>
                  {post.tags.map((tag) => (
                    <li key={tag}>Insights on {tag}</li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 sticky top-24">
                <h3 className="mb-4 font-bold text-gray-900">Share This Article</h3>
                <div className="flex gap-2">
                  {['LinkedIn', 'Twitter', 'Copy Link'].map((platform) => (
                    <button
                      key={platform}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h3 className="mb-4 font-bold text-gray-900">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link key={related.slug} href={`/blog/${related.slug}`} className="block group">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors leading-snug">
                          {related.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">{formatDate(related.publishedAt)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </Container>
      </Section>

      <CTA
        title="Found This Useful?"
        description="Our team produces insights like this every month. Subscribe or contact us to discuss how we can help with your specific technology challenges."
        primaryCta={{ label: 'Contact Our Team', href: '/contact' }}
        secondaryCta={{ label: 'More Articles', href: '/blog' }}
        variant="light"
      />
    </>
  );
}
