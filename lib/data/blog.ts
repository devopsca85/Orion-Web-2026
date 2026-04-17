export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  category: string;
  tags: string[];
  image: string;
  readingTime: number;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'cloud-cost-optimization-strategies-2025',
    title: '7 Cloud Cost Optimization Strategies That Actually Work in 2025',
    excerpt:
      'Cloud costs can spiral out of control without a clear strategy. Here are seven proven approaches our engineers use to reduce cloud spend by 30–50% for our clients without sacrificing performance.',
    author: {
      name: 'Priya Sharma',
      role: 'Head of Cloud Engineering',
      avatar: '/assets/images/team/priya.jpg',
    },
    publishedAt: '2025-11-15',
    category: 'Cloud',
    tags: ['AWS', 'Azure', 'FinOps', 'Cost Optimization', 'Cloud'],
    image: '/assets/images/blog/cloud-cost.jpg',
    readingTime: 8,
    featured: true,
  },
  {
    slug: 'ai-ml-in-enterprise-2025',
    title: 'Practical AI/ML in the Enterprise: Moving Beyond the Hype',
    excerpt:
      'Most enterprise AI initiatives fail not because of technical limitations, but because of poor problem selection and inadequate data strategy. Here is how to set your AI projects up for success.',
    author: {
      name: 'Marcus Chen',
      role: 'Principal Data Scientist',
      avatar: '/assets/images/team/marcus.jpg',
    },
    publishedAt: '2025-10-28',
    category: 'Data & AI',
    tags: ['AI', 'Machine Learning', 'Enterprise', 'Data Strategy'],
    image: '/assets/images/blog/ai-enterprise.jpg',
    readingTime: 10,
    featured: true,
  },
  {
    slug: 'zero-trust-security-architecture',
    title: 'Zero Trust Architecture: A Practical Implementation Guide',
    excerpt:
      'Zero Trust is no longer optional — it is the foundation of modern enterprise security. This guide walks through how to implement Zero Trust principles incrementally in your organization.',
    author: {
      name: 'Jordan Walsh',
      role: 'Cybersecurity Lead',
      avatar: '/assets/images/team/jordan.jpg',
    },
    publishedAt: '2025-10-10',
    category: 'Security',
    tags: ['Zero Trust', 'Cybersecurity', 'Identity', 'Network Security'],
    image: '/assets/images/blog/zero-trust.jpg',
    readingTime: 12,
    featured: true,
  },
  {
    slug: 'microservices-vs-monolith-2025',
    title: 'Microservices vs. Monolith in 2025: Choosing the Right Architecture',
    excerpt:
      'The monolith-vs-microservices debate continues. In 2025, the answer depends heavily on your team size, traffic patterns, and deployment maturity. We break down how to decide.',
    author: {
      name: 'Aisha Okafor',
      role: 'Principal Software Architect',
      avatar: '/assets/images/team/aisha.jpg',
    },
    publishedAt: '2025-09-22',
    category: 'Engineering',
    tags: ['Architecture', 'Microservices', 'Software Design', 'Scalability'],
    image: '/assets/images/blog/architecture.jpg',
    readingTime: 9,
    featured: false,
  },
];

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured).slice(0, 3);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}
