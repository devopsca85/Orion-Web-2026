/**
 * Seed the database with initial data.
 * Run: npm run db:seed  (or: npx prisma db seed)
 *
 * All upserts are idempotent — safe to re-run after schema changes.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { services } from '../lib/data/services';
import { portfolioItems } from '../lib/data/portfolio';
import { blogPosts } from '../lib/data/blog';
import { leadership, stats } from '../lib/data/team';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    id: 'seed-t-1',
    name: 'Sarah Mitchell',
    title: 'CTO',
    company: 'Regional Banking Group',
    quote: "Orion eSolutions transformed our entire technology infrastructure in under 18 months. They didn't just deliver code — they became strategic partners who understood our business goals and helped us achieve them through technology.",
    rating: 5,
    sortOrder: 0,
  },
  {
    id: 'seed-t-2',
    name: 'James Okonkwo',
    title: 'VP of Engineering',
    company: 'National Retail Brand',
    quote: "The cloud migration was seamless. Zero downtime, on budget, and the new infrastructure handles our peak season traffic without breaking a sweat. I wish we had engaged Orion eSolutions sooner.",
    rating: 5,
    sortOrder: 1,
  },
  {
    id: 'seed-t-3',
    name: 'Dr. Linda Hu',
    title: 'CISO',
    company: 'Heritage Healthcare Network',
    quote: "Their cybersecurity team identified vulnerabilities in our systems that our previous provider had missed for years. The remediation was thorough and they left us with a much stronger security posture.",
    rating: 5,
    sortOrder: 2,
  },
  {
    id: 'seed-t-4',
    name: 'Marcus Rivera',
    title: 'COO',
    company: 'FastFreight Logistics',
    quote: "We went from a legacy monolith to a modern microservices platform in six months. Orion's team embedded with ours and delivered an architecture we can scale confidently for the next decade.",
    rating: 5,
    sortOrder: 3,
  },
];

const clientLogos = [
  { id: 'seed-cl-1', name: 'Microsoft', logoUrl: 'https://cdn.simpleicons.org/microsoft/6B7280', sortOrder: 0 },
  { id: 'seed-cl-2', name: 'Amazon Web Services', logoUrl: 'https://cdn.simpleicons.org/amazonaws/6B7280', sortOrder: 1 },
  { id: 'seed-cl-3', name: 'Google Cloud', logoUrl: 'https://cdn.simpleicons.org/googlecloud/6B7280', sortOrder: 2 },
  { id: 'seed-cl-4', name: 'Salesforce', logoUrl: 'https://cdn.simpleicons.org/salesforce/6B7280', sortOrder: 3 },
  { id: 'seed-cl-5', name: 'SAP', logoUrl: 'https://cdn.simpleicons.org/sap/6B7280', sortOrder: 4 },
  { id: 'seed-cl-6', name: 'Oracle', logoUrl: 'https://cdn.simpleicons.org/oracle/6B7280', sortOrder: 5 },
  { id: 'seed-cl-7', name: 'IBM', logoUrl: 'https://cdn.simpleicons.org/ibm/6B7280', sortOrder: 6 },
  { id: 'seed-cl-8', name: 'ServiceNow', logoUrl: 'https://cdn.simpleicons.org/servicenow/6B7280', sortOrder: 7 },
];

const techStack = [
  // Frontend
  { id: 'seed-ts-1', name: 'React', logoUrl: 'https://cdn.simpleicons.org/react', category: 'Frontend', sortOrder: 0 },
  { id: 'seed-ts-2', name: 'Next.js', logoUrl: 'https://cdn.simpleicons.org/nextdotjs', category: 'Frontend', sortOrder: 1 },
  { id: 'seed-ts-3', name: 'TypeScript', logoUrl: 'https://cdn.simpleicons.org/typescript', category: 'Frontend', sortOrder: 2 },
  { id: 'seed-ts-4', name: 'Vue.js', logoUrl: 'https://cdn.simpleicons.org/vuedotjs', category: 'Frontend', sortOrder: 3 },
  { id: 'seed-ts-5', name: 'Angular', logoUrl: 'https://cdn.simpleicons.org/angular', category: 'Frontend', sortOrder: 4 },
  // Backend
  { id: 'seed-ts-6', name: 'Node.js', logoUrl: 'https://cdn.simpleicons.org/nodedotjs', category: 'Backend', sortOrder: 0 },
  { id: 'seed-ts-7', name: 'Python', logoUrl: 'https://cdn.simpleicons.org/python', category: 'Backend', sortOrder: 1 },
  { id: 'seed-ts-8', name: 'Java', logoUrl: 'https://cdn.simpleicons.org/openjdk', category: 'Backend', sortOrder: 2 },
  { id: 'seed-ts-9', name: '.NET', logoUrl: 'https://cdn.simpleicons.org/dotnet', category: 'Backend', sortOrder: 3 },
  { id: 'seed-ts-10', name: 'Go', logoUrl: 'https://cdn.simpleicons.org/go', category: 'Backend', sortOrder: 4 },
  // Cloud
  { id: 'seed-ts-11', name: 'AWS', logoUrl: 'https://cdn.simpleicons.org/amazonaws', category: 'Cloud', sortOrder: 0 },
  { id: 'seed-ts-12', name: 'Azure', logoUrl: 'https://cdn.simpleicons.org/microsoftazure', category: 'Cloud', sortOrder: 1 },
  { id: 'seed-ts-13', name: 'Google Cloud', logoUrl: 'https://cdn.simpleicons.org/googlecloud', category: 'Cloud', sortOrder: 2 },
  { id: 'seed-ts-14', name: 'Kubernetes', logoUrl: 'https://cdn.simpleicons.org/kubernetes', category: 'Cloud', sortOrder: 3 },
  { id: 'seed-ts-15', name: 'Docker', logoUrl: 'https://cdn.simpleicons.org/docker', category: 'Cloud', sortOrder: 4 },
  // Database
  { id: 'seed-ts-16', name: 'PostgreSQL', logoUrl: 'https://cdn.simpleicons.org/postgresql', category: 'Database', sortOrder: 0 },
  { id: 'seed-ts-17', name: 'MySQL', logoUrl: 'https://cdn.simpleicons.org/mysql', category: 'Database', sortOrder: 1 },
  { id: 'seed-ts-18', name: 'MongoDB', logoUrl: 'https://cdn.simpleicons.org/mongodb', category: 'Database', sortOrder: 2 },
  { id: 'seed-ts-19', name: 'Redis', logoUrl: 'https://cdn.simpleicons.org/redis', category: 'Database', sortOrder: 3 },
  // DevOps
  { id: 'seed-ts-20', name: 'Terraform', logoUrl: 'https://cdn.simpleicons.org/terraform', category: 'DevOps', sortOrder: 0 },
  { id: 'seed-ts-21', name: 'GitHub Actions', logoUrl: 'https://cdn.simpleicons.org/githubactions', category: 'DevOps', sortOrder: 1 },
  { id: 'seed-ts-22', name: 'Jenkins', logoUrl: 'https://cdn.simpleicons.org/jenkins', category: 'DevOps', sortOrder: 2 },
  { id: 'seed-ts-23', name: 'Ansible', logoUrl: 'https://cdn.simpleicons.org/ansible', category: 'DevOps', sortOrder: 3 },
];

const faqs = [
  {
    id: 'seed-faq-1',
    question: 'What industries do you serve?',
    answer: 'We serve a broad range of industries including Financial Services, Healthcare & Life Sciences, Retail & E-Commerce, Manufacturing, Government & Public Sector, Education, Telecommunications, and Energy & Utilities. Our teams have domain expertise in each vertical, allowing us to deliver solutions that meet sector-specific compliance, scalability, and integration requirements.',
    category: 'General',
    sortOrder: 0,
  },
  {
    id: 'seed-faq-2',
    question: 'How do you ensure project quality and on-time delivery?',
    answer: 'We follow proven agile methodologies with two-week sprint cycles, daily standups, and transparent project tracking via shared dashboards. Every project has a dedicated QA engineer and delivery manager. We maintain a 98% on-time delivery rate across 500+ completed projects by establishing clear milestones, risk registers, and escalation paths from day one.',
    category: 'General',
    sortOrder: 1,
  },
  {
    id: 'seed-faq-3',
    question: 'What engagement models do you offer?',
    answer: 'We offer three primary engagement models: Fixed Price (ideal for well-defined projects with a clear scope), Time & Material (best for evolving requirements and long-running initiatives), and Dedicated Team (a fully embedded team that works exclusively on your product). We can also blend models — for example, a fixed-price discovery phase followed by a dedicated team for development.',
    category: 'Services',
    sortOrder: 0,
  },
  {
    id: 'seed-faq-4',
    question: 'Do you provide ongoing support and maintenance after launch?',
    answer: 'Yes. We offer flexible post-launch support packages ranging from basic SLA-backed bug fixes to comprehensive managed services including monitoring, performance tuning, security patching, and feature development. Most of our clients move into a long-term support relationship after project delivery.',
    category: 'Services',
    sortOrder: 1,
  },
  {
    id: 'seed-faq-5',
    question: 'How do you handle data security and compliance?',
    answer: 'Security is built into every phase of our delivery process. We follow OWASP secure coding standards, conduct regular penetration testing, and hold certifications including ISO 27001 and SOC 2 Type II. For regulated industries we have deep experience with HIPAA, PCI-DSS, GDPR, and SOX compliance. All client data is handled under strict NDAs and data processing agreements.',
    category: 'Technology',
    sortOrder: 0,
  },
  {
    id: 'seed-faq-6',
    question: 'What is the typical timeline for a software development project?',
    answer: 'Timelines vary by project complexity. A typical MVP takes 8–16 weeks. A mid-size enterprise application runs 4–9 months. Large-scale digital transformation programmes span 12–24 months. We always start with a 2–4 week discovery and scoping phase to produce a detailed project plan with milestones before committing to a final timeline.',
    category: 'General',
    sortOrder: 2,
  },
  {
    id: 'seed-faq-7',
    question: 'Can you work with our existing technology stack?',
    answer: 'Absolutely. We have engineers with expertise across virtually every major technology stack. Whether you are running a Java monolith, a PHP CMS, a legacy .NET system, or a modern cloud-native architecture, we can integrate, extend, or migrate it. We perform a thorough technical audit in the discovery phase to recommend the best path forward for your specific situation.',
    category: 'Technology',
    sortOrder: 1,
  },
  {
    id: 'seed-faq-8',
    question: 'How quickly can you get a team started on our project?',
    answer: 'For most engagements we can have a team mobilised within 2–3 weeks of contract signing. For urgent situations we have a rapid-start programme that can onboard a team in as few as 5 business days. Contact us to discuss your timeline and we will find the fastest path to getting you started.',
    category: 'General',
    sortOrder: 3,
  },
];

const awards = [
  {
    id: 'seed-aw-1',
    title: 'Top IT Services Company',
    issuer: 'Clutch',
    year: 2024,
    description: 'Recognised as a top-rated IT services provider based on verified client reviews.',
    sortOrder: 0,
  },
  {
    id: 'seed-aw-2',
    title: 'Best Digital Transformation Partner',
    issuer: 'CIOReview',
    year: 2024,
    description: 'Named among the 20 most promising digital transformation companies of the year.',
    sortOrder: 1,
  },
  {
    id: 'seed-aw-3',
    title: 'AWS Advanced Consulting Partner',
    issuer: 'Amazon Web Services',
    year: 2023,
    description: 'Achieved Advanced tier status in the AWS Partner Network for cloud expertise.',
    logoUrl: 'https://cdn.simpleicons.org/amazonaws',
    sortOrder: 2,
  },
  {
    id: 'seed-aw-4',
    title: 'Microsoft Solutions Partner',
    issuer: 'Microsoft',
    year: 2023,
    description: 'Certified Microsoft Solutions Partner for Modern Work and Azure infrastructure.',
    logoUrl: 'https://cdn.simpleicons.org/microsoft',
    sortOrder: 3,
  },
];

const engagementModels = [
  {
    id: 'seed-em-1',
    title: 'Fixed Price',
    description: 'Best for well-defined projects with a clear scope, deliverables, and timeline. You know exactly what you are getting and what it costs.',
    features: [
      'Clear budget & delivery timeline',
      'Milestone-based payment schedule',
      'Ideal for fixed-scope projects',
      'Full cost predictability',
      'Formal change request process',
    ],
    sortOrder: 0,
  },
  {
    id: 'seed-em-2',
    title: 'Time & Material',
    description: 'Flexible engagement for projects with evolving requirements. Pay only for the actual hours worked — perfect for innovation and iteration.',
    features: [
      'Maximum flexibility on scope',
      'Transparent billing — pay for actuals',
      'Iterative agile delivery',
      'Adjust team size month-to-month',
      'Ideal for long-running initiatives',
    ],
    sortOrder: 1,
  },
  {
    id: 'seed-em-3',
    title: 'Dedicated Team',
    description: 'Your own fully embedded engineering team working exclusively on your product — fully integrated with your culture, tools, and processes.',
    features: [
      'Full-time dedicated engineers',
      'Direct communication, no middleman',
      'Scales up or down on demand',
      'Deep product knowledge over time',
      'Ideal for product companies',
    ],
    sortOrder: 2,
  },
];

const heroSettings = [
  { key: 'home.hero.eyebrow', value: 'Enterprise Technology Partner' },
  { key: 'home.hero.title', value: 'Transforming Business Through' },
  { key: 'home.hero.highlight', value: 'Technology' },
  { key: 'home.hero.description', value: 'Orion eSolutions delivers innovative software development, cloud solutions, IT consulting, and digital transformation services to enterprises worldwide. We turn complex technology challenges into competitive advantages.' },
  { key: 'home.hero.primaryCtaLabel', value: 'Get a Free Consultation' },
  { key: 'home.hero.primaryCtaHref', value: '/contact' },
  { key: 'home.hero.secondaryCtaLabel', value: 'View Our Work' },
  { key: 'home.hero.secondaryCtaHref', value: '/portfolio' },
  { key: 'home.hero.bullet1', value: '150+ enterprise clients across 18 countries' },
  { key: 'home.hero.bullet2', value: '500+ projects delivered on time and on budget' },
  { key: 'home.hero.bullet3', value: '98% client satisfaction rating' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed…\n');

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
        metaTitle: service.metaTitle?.slice(0, 70) ?? null,
        metaDescription: service.metaDescription?.slice(0, 160) ?? null,
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
        content: post.excerpt,
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
      create: { id: `stat-${index}`, label: stat.label, value: stat.value, sortOrder: index },
    });
  }
  console.log(`  ✓ ${stats.length} site stats`);

  // ── Default Super Admin user ───────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@2026!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@orionesolutions.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@orionesolutions.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('  ✓ Super admin user (admin@orionesolutions.com / Admin@2026!)');

  // ── Testimonials ───────────────────────────────────────────────────────────
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: { name: t.name, title: t.title, company: t.company, quote: t.quote, rating: t.rating },
      create: { ...t, active: true },
    });
  }
  console.log(`  ✓ ${testimonials.length} testimonials`);

  // ── Client Logos ──────────────────────────────────────────────────────────
  for (const logo of clientLogos) {
    await prisma.clientLogo.upsert({
      where: { id: logo.id },
      update: { name: logo.name, logoUrl: logo.logoUrl },
      create: { ...logo, active: true },
    });
  }
  console.log(`  ✓ ${clientLogos.length} client logos`);

  // ── Tech Stack ─────────────────────────────────────────────────────────────
  for (const item of techStack) {
    await prisma.techStack.upsert({
      where: { id: item.id },
      update: { name: item.name, logoUrl: item.logoUrl, category: item.category },
      create: { ...item, active: true },
    });
  }
  console.log(`  ✓ ${techStack.length} tech stack entries`);

  // ── FAQs ───────────────────────────────────────────────────────────────────
  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: faq.id },
      update: { question: faq.question, answer: faq.answer, category: faq.category },
      create: { ...faq, active: true },
    });
  }
  console.log(`  ✓ ${faqs.length} FAQs`);

  // ── Awards ─────────────────────────────────────────────────────────────────
  for (const award of awards) {
    await prisma.award.upsert({
      where: { id: award.id },
      update: { title: award.title, issuer: award.issuer, year: award.year },
      create: { ...award, active: true },
    });
  }
  console.log(`  ✓ ${awards.length} awards`);

  // ── Engagement Models ──────────────────────────────────────────────────────
  for (const model of engagementModels) {
    await prisma.engagementModel.upsert({
      where: { id: model.id },
      update: { title: model.title, description: model.description, features: model.features },
      create: { ...model, active: true },
    });
  }
  console.log(`  ✓ ${engagementModels.length} engagement models`);

  // ── Home Hero SiteSettings ─────────────────────────────────────────────────
  for (const setting of heroSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},          // never overwrite admin-customised values on re-seed
      create: { key: setting.key, value: setting.value },
    });
  }
  console.log(`  ✓ ${heroSettings.length} home hero settings`);

  console.log('\n✅ Seed complete.');
  console.log('\n📋 Next steps:');
  console.log('   1. Ensure DATABASE_URL is set in .env');
  console.log('   2. Run: npm run db:push   (applies new schema)');
  console.log('   3. Run: npm run db:seed   (loads this data)');
  console.log('   4. Run: npm run dev       (start the app)');
  console.log('   5. Visit: /admin/login → admin@orionesolutions.com / Admin@2026!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
