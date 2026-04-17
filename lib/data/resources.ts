export type ResourceType = 'whitepaper' | 'guide' | 'webinar' | 'ebook' | 'report';

export interface Resource {
  slug: string;
  type: ResourceType;
  title: string;
  excerpt: string;
  topic: string;
  downloadUrl?: string;
  watchUrl?: string;
  coverImage: string;
  publishedAt: string;
  gated: boolean;
}

export const resources: Resource[] = [
  { slug: 'cloud-migration-guide-2025', type: 'guide', title: 'The Enterprise Cloud Migration Playbook', excerpt: 'A step-by-step framework for planning and executing large-scale cloud migrations with zero downtime. Covers assessment, strategy, execution, and post-migration optimization across AWS, Azure, and GCP.', topic: 'Cloud', coverImage: '/assets/images/resources/cloud-migration-guide.jpg', publishedAt: '2025-09-01', gated: true },
  { slug: 'ai-readiness-report-2025', type: 'report', title: 'Enterprise AI Readiness Report 2025', excerpt: 'Our annual survey of 300+ enterprise technology leaders reveals the state of AI adoption, the biggest blockers, and what separates AI leaders from laggards. Includes benchmarks by industry.', topic: 'AI & Data', coverImage: '/assets/images/resources/ai-report.jpg', publishedAt: '2025-08-15', gated: true },
  { slug: 'zero-trust-implementation-guide', type: 'whitepaper', title: 'Zero Trust Architecture: Implementation Guide for Enterprise', excerpt: 'A practical whitepaper covering how to design, phase, and implement Zero Trust security across identity, network, data, and application layers in enterprise environments.', topic: 'Cybersecurity', coverImage: '/assets/images/resources/zero-trust.jpg', publishedAt: '2025-07-20', gated: true },
  { slug: 'digital-transformation-roi-ebook', type: 'ebook', title: 'Measuring ROI on Digital Transformation Initiatives', excerpt: 'How to build a business case, define KPIs, and measure the financial and operational return on your digital transformation investments — with real-world examples from our client engagements.', topic: 'Digital Transformation', coverImage: '/assets/images/resources/dt-roi.jpg', publishedAt: '2025-06-10', gated: true },
  { slug: 'data-mesh-webinar', type: 'webinar', title: 'Data Mesh in Practice: Moving Beyond the Hype', excerpt: 'Our Principal Data Architect walks through how three enterprises successfully implemented data mesh — including the organizational changes required and the pitfalls to avoid.', topic: 'Data & Analytics', watchUrl: '#', coverImage: '/assets/images/resources/data-mesh.jpg', publishedAt: '2025-10-05', gated: false },
  { slug: 'cloud-cost-optimization-webinar', type: 'webinar', title: 'Cut Your Cloud Bill by 40%: Proven FinOps Strategies', excerpt: 'Live session covering the seven most impactful cloud cost optimization strategies our engineers use, with live demos of tooling and real client cost reduction examples.', topic: 'Cloud', watchUrl: '#', coverImage: '/assets/images/resources/finops-webinar.jpg', publishedAt: '2025-09-18', gated: false },
];
