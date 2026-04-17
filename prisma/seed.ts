/**
 * Seed the database with initial data from the static TypeScript data files.
 * Run: npx prisma db seed
 */
import { PrismaClient } from '@prisma/client';
import { services } from '../lib/data/services';
import { portfolioItems } from '../lib/data/portfolio';
import { blogPosts } from '../lib/data/blog';
import { leadership, stats } from '../lib/data/team';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed…');

  // ── Services ──────────────────────────────────────────────────────────────
  for (const [index, service] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        slug: service.slug,
        title: service.title,
        shortDesc: service.shortDescription,
        description: service.description,
        icon: service.icon,
        features: service.features,
        benefits: service.benefits,
        technologies: service.technologies,
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        published: true,
        sortOrder: index,
      },
    });
  }
  console.log(`  ✓ ${services.length} services`);

  // ── Portfolio items ────────────────────────────────────────────────────────
  for (const [index, item] of portfolioItems.entries()) {
    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        title: item.title,
        client: item.client,
        industry: item.industry,
        service: item.service,
        challenge: item.challenge,
        solution: item.solution,
        outcome: item.outcome,
        metrics: item.metrics,
        technologies: item.technologies,
        imageUrl: item.image,
        featured: item.featured,
        published: true,
        sortOrder: index,
      },
    });
  }
  console.log(`  ✓ ${portfolioItems.length} portfolio items`);

  // ── Blog authors + posts ───────────────────────────────────────────────────
  for (const post of blogPosts) {
    const author = await prisma.author.upsert({
      where: { id: post.author.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: post.author.name.toLowerCase().replace(/\s+/g, '-'),
        name: post.author.name,
        role: post.author.role,
        avatarUrl: post.author.avatar,
      },
    });

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.excerpt, // placeholder — replace with real content
        category: post.category,
        tags: post.tags,
        authorId: author.id,
        status: 'PUBLISHED',
        featured: post.featured,
        publishedAt: new Date(post.publishedAt),
        readingTime: post.readingTime,
        imageUrl: post.image,
      },
    });
  }
  console.log(`  ✓ ${blogPosts.length} blog posts`);

  // ── Team members ───────────────────────────────────────────────────────────
  for (const [index, member] of leadership.entries()) {
    await prisma.teamMember.upsert({
      where: { id: member.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: member.name.toLowerCase().replace(/\s+/g, '-'),
        name: member.name,
        role: member.role,
        bio: member.bio,
        avatarUrl: member.avatar,
        linkedin: member.linkedin,
        isLeader: true,
        sortOrder: index,
      },
    });
  }
  console.log(`  ✓ ${leadership.length} team members`);

  // ── Site stats ─────────────────────────────────────────────────────────────
  for (const [index, stat] of stats.entries()) {
    await prisma.siteStat.upsert({
      where: { id: `stat-${index}` },
      update: { label: stat.label, value: stat.value },
      create: {
        id: `stat-${index}`,
        label: stat.label,
        value: stat.value,
        sortOrder: index,
      },
    });
  }
  console.log(`  ✓ ${stats.length} site stats`);

  console.log('✅ Seed complete.');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
