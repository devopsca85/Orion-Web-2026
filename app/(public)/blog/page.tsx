import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { blogPosts as staticBlogPosts } from '@/lib/data/blog';
import { generateMetadata as genMeta } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = genMeta({
  title: 'Blog & Insights',
  description:
    'Technology insights, tutorials, and thought leadership from the Orion eSolutions engineering and consulting teams. Cloud, AI, security, and digital transformation.',
  path: '/blog',
  keywords: ['technology blog', 'IT insights', 'cloud blog', 'digital transformation articles'],
});

interface PostCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  authorName: string;
  publishedAt: string;
}

export default async function BlogPage() {
  let posts: PostCard[] = staticBlogPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readingTime: p.readingTime,
    authorName: p.author.name,
    publishedAt: p.publishedAt,
  }));

  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    });
    if (dbPosts.length > 0) {
      posts = dbPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? '',
        category: p.category,
        readingTime: p.readingTime,
        authorName: p.author.name,
        publishedAt: p.publishedAt?.toISOString() ?? p.createdAt.toISOString(),
      }));
    }
  } catch { /* fall back to static */ }

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Blog', url: `${SITE_CONFIG.url}/blog` },
        ]}
      />

      <PageHero
        title="Insights & Ideas"
        description="Practical technology insights from our engineers and consultants — no hype, just substance."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      />

      <Section className="bg-white">
        <Container>
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                  cat === 'All'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug}>
                <Card hover className="flex h-full flex-col">
                  <div className="mb-4 h-40 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-700">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-extrabold text-white/10">{post.category}</span>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="primary">{post.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min read
                    </span>
                  </div>

                  <h2 className="mb-2 flex-1 font-bold text-gray-900 leading-snug hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                      <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
                      aria-label={`Read ${post.title}`}
                    >
                      Read <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Get Insights in Your Inbox"
        description="Subscribe to our newsletter for monthly technology insights from the Orion eSolutions team."
        primaryCta={{ label: 'Subscribe', href: '/contact' }}
        variant="light"
      />
    </>
  );
}
