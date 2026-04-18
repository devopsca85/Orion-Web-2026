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
    instagram: 'https://www.instagram.com/orionesolutions',
  },
  ogImage: '/assets/images/og-image.jpg',
  twitterHandle: '@orionesolutions',
} as const

// ─── Navigation types ─────────────────────────────────────────────────────────

export interface NavChild {
  label: string
  href: string
}

export interface MegaColumn {
  title: string
  href: string
  items: NavChild[]
}

export interface NavLinkSimple   { label: string; href: string }
export interface NavLinkDropdown { label: string; href: string; children: NavChild[] }
export interface NavLinkMega     { label: string; href: string; mega: true; columns: MegaColumn[] }

export interface ProductCard {
  label: string
  href: string
  description: string
  logoUrl: string
}
export interface NavLinkProductMega { label: string; href: string; productMega: true; items: ProductCard[] }

export type NavLink = NavLinkSimple | NavLinkDropdown | NavLinkMega | NavLinkProductMega

// ─── Navigation data (matches live site) ─────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  {
    label: 'Industries',
    href: '/industries',
    children: [
      { label: 'Healthcare & Life Sciences', href: '/industries/healthcare' },
      { label: 'Finance & Banking',          href: '/industries/finance-banking' },
      { label: 'Retail & E-Commerce',        href: '/industries/retail-ecommerce' },
      { label: 'Education & EdTech',         href: '/industries/education' },
      { label: 'Manufacturing',              href: '/industries/manufacturing' },
      { label: 'Real Estate',               href: '/industries/real-estate' },
      { label: 'Government',                href: '/industries/government' },
      { label: 'Logistics & Transportation', href: '/industries/logistics-transportation' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    mega: true,
    columns: [
      {
        title: 'Artificial Intelligence',
        href: '/services/artificial-intelligence',
        items: [
          { label: 'AI Development',                    href: '/services/ai-development' },
          { label: 'Generative AI Development',         href: '/services/generative-ai-development' },
          { label: 'LLM Development',                   href: '/services/llm-development' },
          { label: 'Hire Machine Learning Developers',  href: '/services/hire-machine-learning-developers' },
          { label: 'NLP Services',                      href: '/services/nlp-services' },
          { label: 'AI Consulting',                     href: '/services/ai-consulting' },
        ],
      },
      {
        title: 'Application Development',
        href: '/services/application-development',
        items: [
          { label: 'Software Development',          href: '/services/software-development' },
          { label: 'Custom Application Development', href: '/services/custom-application-development' },
          { label: 'Web Development',               href: '/services/web-development' },
          { label: 'Mobile Application Development', href: '/services/mobile-application-development' },
          { label: 'IT Staff Augmentation',         href: '/services/it-staff-augmentation' },
          { label: 'QA Services',                   href: '/services/qa-services' },
        ],
      },
      {
        title: 'Cloud Services',
        href: '/services/cloud-services',
        items: [
          { label: 'ERP Development',           href: '/services/erp-development' },
          { label: 'DevOps Consulting',          href: '/services/devops-consulting' },
          { label: 'Cloud Managed Services',    href: '/services/cloud-managed-services' },
          { label: 'Cloud Migration Services',  href: '/services/cloud-migration-services' },
          { label: 'CRM Development',           href: '/services/crm-development' },
          { label: 'Cybersecurity',             href: '/services/cybersecurity' },
          { label: 'Managed IT Services',       href: '/services/managed-it-services' },
        ],
      },
      {
        title: 'Technology Development',
        href: '/services/technology-development',
        items: [
          { label: 'React JS Development',     href: '/services/react-js-development' },
          { label: 'React Native Development', href: '/services/react-native-development' },
          { label: 'Ionic App Development',    href: '/services/ionic-app-development' },
          { label: 'Dot Net Development',      href: '/services/dot-net-development' },
          { label: 'CodeIgniter Development',  href: '/services/codeigniter-development' },
          { label: 'API Web Services',         href: '/services/api-web-services' },
          { label: 'Zend Web Development',     href: '/services/zend-web-development' },
        ],
      },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    productMega: true,
    items: [
      { label: 'Orion ERP',             href: '/products/orion-erp',             description: 'Cloud-native, modular ERP unifying finance, supply chain, HR, and projects with real-time insights.',                    logoUrl: '/assets/images/logo.png' },
      { label: 'Orion CRM',             href: '/products/orion-crm',             description: 'Intelligent CRM that tracks leads, automates follow-ups, and closes deals faster.',                                        logoUrl: '/assets/images/logo.png' },
      { label: 'Orion Analytics',       href: '/products/orion-analytics',       description: 'Real-time business intelligence dashboards that turn raw data into actionable insights.',                                  logoUrl: '/assets/images/logo.png' },
      { label: 'Orion HR Suite',        href: '/products/orion-hr-suite',        description: 'End-to-end HR management from recruitment and onboarding through payroll and performance reviews.',                        logoUrl: '/assets/images/logo.png' },
      { label: 'Orion Customer Portal', href: '/products/orion-customer-portal', description: 'Self-service portal giving customers 24/7 access to support tickets, invoices, and project status.',                      logoUrl: '/assets/images/logo.png' },
    ],
  },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Careers',      href: '/careers' },
  { label: 'Blog',         href: '/blog' },
  { label: 'Contact Us',   href: '/contact' },
]

// ─── Footer links ─────────────────────────────────────────────────────────────

export const FOOTER_LINKS = {
  services: [
    { label: 'AI Development',             href: '/services/ai-development' },
    { label: 'Software Development',       href: '/services/software-development' },
    { label: 'Web Development',            href: '/services/web-development' },
    { label: 'Mobile App Development',     href: '/services/mobile-application-development' },
    { label: 'Cloud Managed Services',     href: '/services/cloud-managed-services' },
    { label: 'Cybersecurity',             href: '/services/cybersecurity' },
    { label: 'DevOps Consulting',         href: '/services/devops-consulting' },
    { label: 'IT Staff Augmentation',     href: '/services/it-staff-augmentation' },
  ],
  industries: [
    { label: 'Healthcare',          href: '/industries/healthcare' },
    { label: 'Finance & Banking',   href: '/industries/finance-banking' },
    { label: 'Retail & E-Commerce', href: '/industries/retail-ecommerce' },
    { label: 'Education',           href: '/industries/education' },
    { label: 'Manufacturing',       href: '/industries/manufacturing' },
    { label: 'Government',         href: '/industries/government' },
  ],
  company: [
    { label: 'About Us',    href: '/about' },
    { label: 'Portfolio',   href: '/portfolio' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog',        href: '/blog' },
    { label: 'Careers',     href: '/careers' },
    { label: 'Contact',     href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy',   href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy',    href: '/cookie-policy' },
    { label: 'Sitemap',         href: '/sitemap-page' },
  ],
} as const
