export interface PortfolioItem {
  slug: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  challenge: string;
  solution: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  image: string;
  featured: boolean;
}

export const portfolioItems: PortfolioItem[] = [
  {
    slug: 'fintech-platform-modernization',
    title: 'FinTech Platform Modernization',
    client: 'Regional Banking Group',
    industry: 'Financial Services',
    service: 'Digital Transformation',
    challenge:
      'A regional bank operating on a 15-year-old monolithic core banking system faced increasing downtime, rising maintenance costs, and an inability to launch new digital products quickly.',
    solution:
      'We designed and executed a phased migration to a microservices architecture on AWS, replacing legacy modules incrementally with zero customer disruption. We also built a new React-based customer portal.',
    outcome:
      'The bank launched three new digital products in the first year post-migration, reduced operational costs significantly, and improved system uptime.',
    metrics: [
      { label: 'Deployment Frequency', value: '10× faster' },
      { label: 'System Uptime', value: '99.99%' },
      { label: 'Cost Reduction', value: '35%' },
      { label: 'New Products Launched', value: '3' },
    ],
    technologies: ['AWS', 'Kubernetes', 'React', 'Node.js', 'PostgreSQL', 'Kafka', 'Terraform'],
    image: '/assets/images/portfolio/fintech.jpg',
    featured: true,
  },
  {
    slug: 'healthcare-data-platform',
    title: 'Healthcare Analytics Platform',
    client: 'Multi-site Healthcare Network',
    industry: 'Healthcare',
    service: 'Data & Analytics',
    challenge:
      'A healthcare network with 12 facilities was unable to get a unified view of patient outcomes across its system, hindering clinical decision-making and regulatory reporting.',
    solution:
      'We built a HIPAA-compliant centralized data platform on Snowflake, ingesting data from five disparate EMR systems via real-time pipelines and exposing insights through Power BI dashboards.',
    outcome:
      'Clinical leadership gained real-time visibility into network-wide patient outcomes, enabling a measurable improvement in care coordination and a significant reduction in reporting time.',
    metrics: [
      { label: 'Reporting Time', value: '80% faster' },
      { label: 'Data Sources Unified', value: '5 EMRs' },
      { label: 'Dashboard Users', value: '200+' },
      { label: 'Compliance', value: 'HIPAA certified' },
    ],
    technologies: ['Snowflake', 'dbt', 'Apache Airflow', 'Power BI', 'Python', 'Azure', 'HL7 FHIR'],
    image: '/assets/images/portfolio/healthcare.jpg',
    featured: true,
  },
  {
    slug: 'ecommerce-cloud-migration',
    title: 'E-Commerce Cloud Migration',
    client: 'National Retail Brand',
    industry: 'Retail & E-Commerce',
    service: 'Cloud Solutions',
    challenge:
      'A national retailer\'s on-premise infrastructure was unable to handle peak shopping season traffic, resulting in repeated site outages and lost revenue.',
    solution:
      'We migrated the e-commerce platform to AWS with auto-scaling architecture, implemented a CDN strategy via CloudFront, and established a blue-green deployment pipeline to eliminate downtime during releases.',
    outcome:
      'The retailer successfully handled a 400% traffic surge during its next peak season with zero downtime, and cloud infrastructure costs were significantly reduced compared to previous on-premise TCO.',
    metrics: [
      { label: 'Peak Traffic Handled', value: '400% surge' },
      { label: 'Downtime During Migration', value: '0 minutes' },
      { label: 'Infrastructure Cost', value: '40% reduction' },
      { label: 'Page Load Time', value: '2.1s avg' },
    ],
    technologies: ['AWS', 'CloudFront', 'EC2', 'RDS', 'ElastiCache', 'Terraform', 'GitHub Actions'],
    image: '/assets/images/portfolio/ecommerce.jpg',
    featured: true,
  },
  {
    slug: 'manufacturing-iot-platform',
    title: 'Smart Manufacturing IoT Platform',
    client: 'Industrial Manufacturer',
    industry: 'Manufacturing',
    service: 'Software Development',
    challenge:
      'A manufacturer with 8 plants had no real-time visibility into machine performance, resulting in unplanned downtime and excessive maintenance costs.',
    solution:
      'We built an IoT data ingestion platform on Azure IoT Hub, processing sensor streams from 500+ machines into a time-series database and surfacing predictive maintenance alerts via a custom dashboard.',
    outcome:
      'Unplanned downtime was significantly reduced and maintenance teams could proactively address issues before they caused production halts.',
    metrics: [
      { label: 'Unplanned Downtime', value: '60% reduction' },
      { label: 'Machines Connected', value: '500+' },
      { label: 'Maintenance Cost', value: '25% saving' },
      { label: 'Alert Response Time', value: '<5 minutes' },
    ],
    technologies: ['Azure IoT Hub', 'TimescaleDB', 'Python', 'React', 'Grafana', 'MQTT', 'Docker'],
    image: '/assets/images/portfolio/manufacturing.jpg',
    featured: false,
  },
];

export function getFeaturedPortfolio(): PortfolioItem[] {
  return portfolioItems.filter((item) => item.featured);
}

export function getPortfolioBySlug(slug: string): PortfolioItem | undefined {
  return portfolioItems.find((item) => item.slug === slug);
}
