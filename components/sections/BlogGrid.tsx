import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { getFeaturedPosts } from '@/lib/data/blog';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

interface PostCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  publishedAt: Date | string | null;
  imageUrl: string | null;
  author: { name: string };
}

function BlogCard({ post }: { post: PostCardData }) {
  return (
    <article className="group flex flex-col">
      <Card hover className="flex flex-col h-full overflow-hidden !p-0">
        {/* Feature image */}
        {post.imageUrl && (
          <div className="relative h-48 overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {post.category}
            </span>
          </div>
        )}
        <div className="flex flex-col flex-1 p-5">
          {!post.imageUrl && (
            <div className="mb-3 flex items-center justify-between">
              <Badge variant="primary">{post.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />{post.readingTime} min read
              </span>
            </div>
          )}
          {post.imageUrl && (
            <span className="mb-2 flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />{post.readingTime} min read
            </span>
          )}
          <h3 className="mb-2 font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-400">{post.publishedAt ? formatDate(post.publishedAt instanceof Date ? post.publishedAt.toISOString() : String(post.publishedAt)) : ''}</p>
            </div>
            <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all">
              Read <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Card>
    </article>
  );
}

interface BlogGridProps {
  limit?: number;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export async function BlogGrid({
  limit = 3,
  eyebrow = 'Insights',
  title = 'Technology Insights & Expertise',
  description = 'Practical insights from our engineers and consultants on cloud, AI, security, and digital transformation.',
}: BlogGridProps) {
  let dbPosts: PostCardData[] = [];
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
      select: {
        slug: true, title: true, excerpt: true, category: true,
        readingTime: true, publishedAt: true, imageUrl: true,
        author: { select: { name: true } },
      },
    });
    dbPosts = rows;
  } catch { /* fall back */ }

  const staticPosts: PostCardData[] = getFeaturedPosts().slice(0, limit).map(p => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category,
    readingTime: p.readingTime, publishedAt: p.publishedAt,
    imageUrl: null,
    author: { name: p.author.name },
  }));
  const posts: PostCardData[] = dbPosts.length > 0 ? dbPosts : staticPosts;

  return (
    <Section className="bg-gray-50">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-700 transition-colors">
            View all articles <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
