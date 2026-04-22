export interface Industry {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  challenges: string[];
  solutions: string[];
  services: string[];
  stats: { label: string; value: string }[];
  metaTitle?: string;
  metaDescription?: string;
}

export const industries: Industry[] = [
  {
    slug: 'financial-services',
    title: 'Financial Services',
    shortDescription: 'Secure, compliant, and scalable technology for banks, fintechs, and insurers.',
    description:
      'Financial institutions face mounting pressure to modernize legacy systems, meet evolving regulatory requirements, and deliver seamless digital experiences. Orion eSolutions brings deep domain expertise in financial technology — from core banking modernization to AI-powered risk analytics.',
    icon: 'Landmark',
    challenges: [
      'Legacy core banking systems that slow innovation',
      'Strict regulatory compliance (PCI-DSS, SOX, GDPR, Basel III)',
      'Rising customer expectations for digital-first experiences',
      'Cybersecurity threats and fraud prevention',
      'Real-time payment and transaction processing demands',
    ],
    solutions: [
      'Core banking system modernization and microservices migration',
      'Open banking API development and PSD2 compliance',
      'Anti-fraud and AML solutions using machine learning',
      'Cloud-native infrastructure on AWS or Azure with financial-grade security',
      'Customer-facing mobile and web banking applications',
    ],
    services: ['software-development', 'cloud-solutions', 'cybersecurity', 'data-analytics'],
    stats: [
      { label: 'Financial Clients', value: '40+' },
      { label: 'Regulatory Frameworks', value: '12+' },
      { label: 'Avg. Cost Reduction', value: '32%' },
      { label: 'Uptime SLA Delivered', value: '99.99%' },
    ],
    metaTitle: 'Financial Services Technology Solutions',
    metaDescription:
      'Orion eSolutions delivers secure, compliant fintech solutions — core banking modernization, open banking APIs, fraud detection, and cloud migration for financial institutions.',
  },
  {
    slug: 'healthcare',
    title: 'Healthcare & Life Sciences',
    shortDescription: 'HIPAA-compliant digital health solutions that improve patient outcomes.',
    description:
      'Healthcare organizations need technology that is not just powerful, but safe, interoperable, and compliant. Orion eSolutions designs and builds clinical systems, patient engagement platforms, and healthcare analytics solutions that meet the strict demands of HIPAA, HL7 FHIR, and other standards.',
    icon: 'HeartPulse',
    challenges: [
      'Fragmented data across disparate EHR and EMR systems',
      'HIPAA and HITECH compliance requirements',
      'Interoperability between clinical and administrative systems',
      'Increasing demand for telehealth and remote patient monitoring',
      'Cost pressure and need for operational efficiency',
    ],
    solutions: [
      'HIPAA-compliant data platforms integrating multiple EHR/EMR systems',
      'Telehealth and remote patient monitoring applications',
      'Clinical decision support systems powered by AI and ML',
      'Revenue cycle management (RCM) automation',
      'Patient engagement portals and mobile health apps',
    ],
    services: ['software-development', 'data-analytics', 'cloud-solutions', 'cybersecurity'],
    stats: [
      { label: 'Healthcare Clients', value: '25+' },
      { label: 'EHR Systems Integrated', value: '8+' },
      { label: 'Avg. Reporting Time Saved', value: '70%' },
      { label: 'HIPAA Compliance', value: '100%' },
    ],
    metaTitle: 'Healthcare Technology Solutions',
    metaDescription:
      'Orion eSolutions builds HIPAA-compliant healthcare platforms — EHR integration, telehealth apps, clinical analytics, and patient engagement solutions for providers and payers.',
  },
  {
    slug: 'retail-ecommerce',
    title: 'Retail & E-Commerce',
    shortDescription: 'Scalable commerce platforms and personalized customer experiences that drive revenue.',
    description:
      'Retail is being redefined by digital-first consumers, omnichannel expectations, and supply chain complexity. Orion eSolutions helps retailers build the commerce infrastructure they need to compete — from high-performance e-commerce platforms to AI-driven personalization and inventory intelligence.',
    icon: 'ShoppingCart',
    challenges: [
      'Handling traffic spikes during peak shopping seasons',
      'Delivering consistent omnichannel customer experiences',
      'Inventory management and supply chain visibility',
      'Personalization at scale across millions of customers',
      'Legacy POS and ERP system integration',
    ],
    solutions: [
      'Cloud-native, auto-scaling e-commerce platform engineering',
      'Headless commerce architecture (Shopify, Commercetools, custom)',
      'AI-powered product recommendation and personalization engines',
      'Unified inventory management and supply chain analytics',
      'Loyalty program platforms and customer data platforms (CDP)',
    ],
    services: ['software-development', 'cloud-solutions', 'data-analytics', 'digital-transformation'],
    stats: [
      { label: 'Retail Clients', value: '30+' },
      { label: 'Peak Traffic Handled', value: '10M+ req/hr' },
      { label: 'Avg. Conversion Uplift', value: '18%' },
      { label: 'Avg. Page Load (CDN)', value: '<1.5s' },
    ],
    metaTitle: 'Retail & E-Commerce Technology Solutions',
    metaDescription:
      'Orion eSolutions builds scalable retail technology — headless commerce platforms, AI personalization, inventory intelligence, and omnichannel experiences that drive growth.',
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing & Industrial',
    shortDescription: 'Smart manufacturing, IoT, and digital operations for Industry 4.0.',
    description:
      'Manufacturing is undergoing a digital revolution driven by IoT, automation, and data. Orion eSolutions helps manufacturers connect their shop floors to the cloud, implement predictive maintenance, optimize supply chains, and build the operational intelligence they need to compete in an Industry 4.0 world.',
    icon: 'Factory',
    challenges: [
      'Unplanned equipment downtime and reactive maintenance',
      'Lack of real-time visibility across production lines',
      'Disconnected OT and IT systems',
      'Supply chain disruptions and inventory inefficiency',
      'Quality control and defect detection at scale',
    ],
    solutions: [
      'IoT sensor integration and edge computing for shop floor connectivity',
      'Predictive maintenance platforms using machine learning',
      'Manufacturing Execution System (MES) integration and modernization',
      'Supply chain visibility and demand forecasting analytics',
      'Computer vision-based quality inspection systems',
    ],
    services: ['software-development', 'data-analytics', 'cloud-solutions', 'digital-transformation'],
    stats: [
      { label: 'Manufacturing Clients', value: '20+' },
      { label: 'Machines Connected', value: '5,000+' },
      { label: 'Avg. Downtime Reduction', value: '55%' },
      { label: 'OEE Improvement', value: '22%' },
    ],
    metaTitle: 'Manufacturing Technology Solutions — Industry 4.0',
    metaDescription:
      'Orion eSolutions powers smart manufacturing with IoT, predictive maintenance, MES integration, and supply chain analytics for Industry 4.0 transformation.',
  },
  {
    slug: 'government-public-sector',
    title: 'Government & Public Sector',
    shortDescription: 'Secure, citizen-centric digital government solutions built for trust and compliance.',
    description:
      'Government agencies face the dual challenge of modernizing aging systems while maintaining the highest standards of security, accessibility, and compliance. Orion eSolutions has experience delivering mission-critical technology for federal, state, and local government clients — always with security-first design and accessibility (WCAG 2.1 AA) built in.',
    icon: 'Building2',
    challenges: [
      'Legacy mainframe and monolithic system modernization',
      'FedRAMP, FISMA, and data sovereignty compliance',
      'Citizen-facing digital service delivery and accessibility (WCAG 2.1 AA)',
      'Interoperability between agencies and jurisdictions',
      'Procurement constraints and budget cycles',
    ],
    solutions: [
      'Legacy system modernization with zero-disruption migration strategies',
      'FedRAMP-compliant cloud architecture on AWS GovCloud or Azure Government',
      'Accessible citizen portals and self-service platforms (WCAG 2.1 AA)',
      'Secure inter-agency data sharing and API platforms',
      'Case management and workflow automation systems',
    ],
    services: ['software-development', 'cloud-solutions', 'cybersecurity', 'it-consulting'],
    stats: [
      { label: 'Government Clients', value: '15+' },
      { label: 'Security Clearance Level', value: 'Up to TS' },
      { label: 'WCAG Compliance', value: '100%' },
      { label: 'Uptime SLA', value: '99.95%+' },
    ],
    metaTitle: 'Government & Public Sector IT Solutions',
    metaDescription:
      'Orion eSolutions delivers secure, compliant digital government solutions — FedRAMP-compliant cloud, legacy modernization, citizen portals, and accessible services.',
  },
  {
    slug: 'education',
    title: 'Education & EdTech',
    shortDescription: 'Digital learning platforms and campus technology that transform educational outcomes.',
    description:
      'Educational institutions are reimagining how they deliver learning in a hybrid world. Orion eSolutions builds scalable, accessible digital learning platforms, student information systems, and campus technology solutions that improve outcomes for students, faculty, and administrators alike.',
    icon: 'GraduationCap',
    challenges: [
      'Delivering consistent learning experiences across in-person and remote students',
      'Siloed student data across LMS, SIS, and administrative systems',
      'Accessibility and equity in digital learning delivery',
      'FERPA compliance and student data privacy',
      'Budget constraints in non-profit and public institutions',
    ],
    solutions: [
      'Custom LMS development and integration with Canvas, Moodle, and Blackboard',
      'Unified student data platforms connecting LMS, SIS, and CRM',
      'Adaptive learning and AI-driven personalized curriculum tools',
      'FERPA-compliant data governance and privacy frameworks',
      'Accessible digital learning tools (WCAG 2.1 AA)',
    ],
    services: ['software-development', 'data-analytics', 'cloud-solutions', 'digital-transformation'],
    stats: [
      { label: 'Education Clients', value: '18+' },
      { label: 'Students Reached', value: '500K+' },
      { label: 'FERPA Compliance', value: '100%' },
      { label: 'Avg. Student Engagement', value: '+35%' },
    ],
    metaTitle: 'Education Technology Solutions & EdTech',
    metaDescription:
      'Orion eSolutions builds accessible, FERPA-compliant digital learning platforms, student data systems, and campus technology for universities and K-12 institutions.',
  },
  {
    slug: 'telecommunications',
    title: 'Telecommunications',
    shortDescription: 'BSS/OSS modernization and network analytics for telcos navigating digital disruption.',
    description:
      'Telecommunications companies are racing to deploy 5G, manage network complexity, and deliver new digital services while reducing costs. Orion eSolutions helps telcos modernize their BSS/OSS stacks, build real-time network analytics platforms, and create compelling digital customer experiences.',
    icon: 'Wifi',
    challenges: [
      'Legacy BSS/OSS systems slowing service innovation',
      '5G network rollout complexity and cost management',
      'Rising customer churn and demand for digital self-service',
      'Network performance monitoring across distributed infrastructure',
      'Real-time fraud detection for voice and data services',
    ],
    solutions: [
      'BSS/OSS modernization and API-first integration architecture',
      'Real-time network analytics and performance monitoring dashboards',
      'Customer self-service portals and digital onboarding flows',
      'AI-powered churn prediction and proactive retention systems',
      'Telco fraud detection using streaming analytics',
    ],
    services: ['software-development', 'data-analytics', 'cloud-solutions', 'cybersecurity'],
    stats: [
      { label: 'Telco Clients', value: '12+' },
      { label: 'Network Events Processed/sec', value: '1M+' },
      { label: 'Avg. Churn Reduction', value: '28%' },
      { label: 'Self-Service Adoption', value: '+45%' },
    ],
    metaTitle: 'Telecommunications Technology Solutions',
    metaDescription:
      'Orion eSolutions modernizes telco BSS/OSS systems, builds 5G-ready analytics platforms, and creates digital customer experiences that reduce churn and drive ARPU growth.',
  },
  {
    slug: 'energy-utilities',
    title: 'Energy & Utilities',
    shortDescription: 'Smart grid, renewable energy, and operational technology solutions for a sustainable future.',
    description:
      'The energy sector is undergoing its greatest transformation in a century. Orion eSolutions helps utilities and energy companies navigate the transition to renewable energy, modernize their grid infrastructure, and build the real-time operational intelligence needed to manage increasingly complex energy systems.',
    icon: 'Zap',
    challenges: [
      'Aging grid infrastructure and operational technology modernization',
      'Integration of distributed renewable energy sources (solar, wind)',
      'Regulatory compliance (NERC CIP, FERC) and cybersecurity for OT/IT convergence',
      'Customer demand for renewable energy transparency and billing tools',
      'Real-time grid monitoring and outage prediction',
    ],
    solutions: [
      'Smart grid data platform and SCADA system integration',
      'Renewable energy management and forecasting systems',
      'NERC CIP-compliant cybersecurity for OT/IT environments',
      'Customer energy portal with real-time usage and billing analytics',
      'Predictive grid maintenance and outage management systems',
    ],
    services: ['software-development', 'data-analytics', 'cybersecurity', 'cloud-solutions'],
    stats: [
      { label: 'Energy Clients', value: '10+' },
      { label: 'Grid Sensors Monitored', value: '50K+' },
      { label: 'Outage Prediction Accuracy', value: '89%' },
      { label: 'NERC CIP Compliant', value: 'Yes' },
    ],
    metaTitle: 'Energy & Utilities Technology Solutions',
    metaDescription:
      'Orion eSolutions builds smart grid platforms, renewable energy management systems, and NERC CIP-compliant OT/IT cybersecurity solutions for utilities and energy companies.',
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
