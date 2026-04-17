/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.orionesolutions.com',
  generateRobotsTxt: false, // robots.txt is managed via app/robots.ts
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/admin/*'],
  additionalPaths: async (config) => {
    return [
      await config.transform(config, '/'),
      await config.transform(config, '/about'),
      await config.transform(config, '/services'),
      await config.transform(config, '/portfolio'),
      await config.transform(config, '/blog'),
      await config.transform(config, '/contact'),
      await config.transform(config, '/careers'),
    ];
  },
};
