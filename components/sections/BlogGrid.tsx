import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { getFeaturedPosts, type BlogPost } from '@/lib/data/blog';
import { formatDate } from '@/lib/utils';

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex flex-col">
      <Card hover className="flex flex-col h-full">
        {/* Category + date */}
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="primary">{post.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        </div>

        <h3 className="mb-2 font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
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
  );
}

interface BlogGridProps {
  limit?: number;
}

export function BlogGrid({ limit = 3 }: BlogGridProps) {
  const posts = getFeaturedPosts().slice(0, limit);

  return (
    <Section className="bg-gray-50">
      <Container>
        <SectionHeader
          eyebrow="Insights"
          title="Technology Insights & Expertise"
          description="Practical insights from our engineers and consultants on cloud, AI, security, and digital transformation."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-700 transition-colors"
          >
            View all articles <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
