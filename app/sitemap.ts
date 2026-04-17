import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { services } from '@/lib/data/services';
import { portfolioItems } from '@/lib/data/portfolio';
import { blogPosts } from '@/lib/data/blog';
import { industries } from '@/lib/data/industries';
import { resources } from '@/lib/data/resources';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/about`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about/culture`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about/certifications`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${base}/about/csr`,                lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/services`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/industries`,               lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/portfolio`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/blog`,                     lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/resources`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/partners`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/careers`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${base}/privacy-policy`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms-of-service`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/cookie-policy`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${base}/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const portfolioPages: MetadataRoute.Sitemap = portfolioItems.map((item) => ({
    url: `${base}/portfolio/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const resourcePages: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${base}/resources/${r.slug}`,
    lastModified: new Date(r.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...industryPages,
    ...portfolioPages,
    ...blogPages,
    ...resourcePages,
  ];
}
