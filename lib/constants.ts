export const SITE_CONFIG = {
  name: 'Orion eSolutions',
  tagline: 'Transforming Business Through Technology',
  description:
    'Orion eSolutions delivers innovative technology solutions — software development, cloud, IT consulting, and digital transformation — for businesses worldwide.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.orionesolutions.com',
  email: 'support@orionesolutions.com',
  phone: '+1 (800) 000-0000',
  address: {
    street: '100 Technology Drive',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/orionesolutions',
    twitter: 'https://twitter.com/orionesolutions',
    facebook: 'https://www.facebook.com/orionesolutions',
    youtube: 'https://www.youtube.com/@orionesolutions',
  },
  ogImage: '/assets/images/og-image.jpg',
  twitterHandle: '@orionesolutions',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Software Development', href: '/services/software-development' },
      { label: 'Cloud Solutions', href: '/services/cloud-solutions' },
      { label: 'IT Consulting', href: '/services/it-consulting' },
      { label: 'Digital Transformation', href: '/services/digital-transformation' },
      { label: 'Cybersecurity', href: '/services/cybersecurity' },
      { label: 'Data & Analytics', href: '/services/data-analytics' },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
    children: [
      { label: 'Financial Services', href: '/industries/financial-services' },
      { label: 'Healthcare & Life Sciences', href: '/industries/healthcare' },
      { label: 'Retail & E-Commerce', href: '/industries/retail-ecommerce' },
      { label: 'Manufacturing', href: '/industries/manufacturing' },
      { label: 'Government & Public Sector', href: '/industries/government-public-sector' },
      { label: 'Education & EdTech', href: '/industries/education' },
      { label: 'Telecommunications', href: '/industries/telecommunications' },
      { label: 'Energy & Utilities', href: '/industries/energy-utilities' },
    ],
  },
  {
    label: 'Company',
    href: '/about',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Culture', href: '/about/culture' },
      { label: 'Certifications', href: '/about/certifications' },
      { label: 'Corporate Responsibility', href: '/about/csr' },
      { label: 'Partners', href: '/partners' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'All Resources', href: '/resources' },
      { label: 'Blog & Insights', href: '/blog' },
      { label: 'Guides & Whitepapers', href: '/resources' },
      { label: 'Webinars', href: '/resources' },
    ],
  },
  { label: 'Contact', href: '/contact' },
] as const;

export const FOOTER_LINKS = {
  services: [
    { label: 'Software Development', href: '/services/software-development' },
    { label: 'Cloud Solutions', href: '/services/cloud-solutions' },
    { label: 'IT Consulting', href: '/services/it-consulting' },
    { label: 'Digital Transformation', href: '/services/digital-transformation' },
    { label: 'Cybersecurity', href: '/services/cybersecurity' },
    { label: 'Data & Analytics', href: '/services/data-analytics' },
  ],
  industries: [
    { label: 'Financial Services', href: '/industries/financial-services' },
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'Retail & E-Commerce', href: '/industries/retail-ecommerce' },
    { label: 'Manufacturing', href: '/industries/manufacturing' },
    { label: 'Government', href: '/industries/government-public-sector' },
    { label: 'Education', href: '/industries/education' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Culture', href: '/about/culture' },
    { label: 'Certifications', href: '/about/certifications' },
    { label: 'Partners', href: '/partners' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Resources', href: '/resources' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Sitemap', href: '/sitemap-page' },
  ],
} as const;
