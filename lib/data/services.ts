export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  benefits: string[];
  technologies: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export const services: Service[] = [
  {
    slug: 'software-development',
    title: 'Software Development',
    shortDescription: 'Custom software solutions tailored to your unique business needs and goals.',
    description:
      'We design and build scalable, high-performance software applications that solve real business problems. From web and mobile apps to enterprise platforms, our engineering teams deliver reliable, maintainable code using modern development practices.',
    icon: 'Code2',
    features: [
      'Full-stack web application development',
      'Native and cross-platform mobile apps',
      'API design and microservices architecture',
      'Legacy system modernization',
      'Quality assurance and automated testing',
      'Continuous integration & deployment (CI/CD)',
    ],
    benefits: [
      'Accelerate time-to-market with agile delivery',
      'Reduce technical debt through clean architecture',
      'Scale confidently with cloud-native design',
      'Ensure reliability with comprehensive test coverage',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'Python', 'Java', '.NET', 'TypeScript', 'PostgreSQL', 'MongoDB'],
    metaTitle: 'Custom Software Development Services',
    metaDescription:
      'Orion eSolutions builds scalable, high-performance custom software — web apps, mobile apps, APIs, and enterprise platforms tailored to your business.',
  },
  {
    slug: 'cloud-solutions',
    title: 'Cloud Solutions',
    shortDescription: 'Migrate, optimize, and manage your infrastructure on AWS, Azure, or GCP.',
    description:
      'Our cloud engineers help you design and implement resilient, cost-efficient cloud architectures. Whether you are migrating from on-premise systems or optimizing an existing cloud environment, we bring proven expertise across AWS, Microsoft Azure, and Google Cloud Platform.',
    icon: 'Cloud',
    features: [
      'Cloud migration strategy and execution',
      'Infrastructure as Code (Terraform, Pulumi)',
      'Kubernetes and container orchestration',
      'Cost optimization and FinOps',
      'Multi-cloud and hybrid cloud architectures',
      'Disaster recovery and business continuity',
    ],
    benefits: [
      'Reduce infrastructure costs by up to 40%',
      'Improve deployment frequency and reliability',
      'Scale resources automatically to meet demand',
      'Achieve high availability with multi-region architectures',
    ],
    technologies: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD'],
    metaTitle: 'Cloud Solutions & Migration Services',
    metaDescription:
      'Expert cloud migration, optimization, and management on AWS, Azure, and GCP. Orion eSolutions helps you build resilient, cost-efficient cloud infrastructure.',
  },
  {
    slug: 'it-consulting',
    title: 'IT Consulting',
    shortDescription: 'Strategic technology advisory to align your IT investments with business outcomes.',
    description:
      'Our senior consultants work alongside your leadership team to assess your technology landscape, identify gaps, and craft a clear roadmap for growth. We combine deep technical expertise with business acumen to deliver actionable recommendations that drive measurable results.',
    icon: 'Lightbulb',
    features: [
      'Technology assessment and gap analysis',
      'IT strategy and roadmap development',
      'Vendor selection and due diligence',
      'Enterprise architecture review',
      'IT governance and risk management',
      'Digital maturity benchmarking',
    ],
    benefits: [
      'Align technology investments with business strategy',
      'Reduce risk through informed technology decisions',
      'Accelerate innovation with a clear digital roadmap',
      'Optimize IT spend and maximize ROI',
    ],
    technologies: ['TOGAF', 'ITIL', 'COBIT', 'Agile', 'SAFe', 'PRINCE2'],
    metaTitle: 'IT Consulting & Technology Strategy',
    metaDescription:
      'Strategic IT consulting from Orion eSolutions. We help businesses align technology investments with goals through assessment, roadmapping, and expert advisory.',
  },
  {
    slug: 'digital-transformation',
    title: 'Digital Transformation',
    shortDescription: 'End-to-end digital transformation to modernize operations and unlock new value.',
    description:
      'Digital transformation is more than technology — it is a fundamental shift in how your organization operates and delivers value. Orion eSolutions guides you through the entire journey: strategy, process re-engineering, technology implementation, and change management.',
    icon: 'Zap',
    features: [
      'Digital transformation strategy and visioning',
      'Business process automation (RPA, AI)',
      'Customer experience (CX) modernization',
      'Data-driven decision making enablement',
      'Organizational change management',
      'Innovation lab and proof-of-concept development',
    ],
    benefits: [
      'Increase operational efficiency by automating manual processes',
      'Improve customer satisfaction through digital-first experiences',
      'Enable data-driven decision making across the organization',
      'Create new revenue streams through digital products',
    ],
    technologies: ['AI/ML', 'RPA', 'Power Platform', 'Salesforce', 'SAP', 'ServiceNow', 'Low-code/No-code'],
    metaTitle: 'Digital Transformation Services',
    metaDescription:
      'Orion eSolutions accelerates digital transformation — from strategy through execution. Automate processes, modernize experiences, and drive data-driven growth.',
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    shortDescription: 'Protect your business with proactive security assessment and implementation.',
    description:
      'Cyber threats are evolving constantly. Our security experts help you identify vulnerabilities, implement robust defenses, and build a security-first culture. From penetration testing to SOC implementation, we provide comprehensive protection for your digital assets.',
    icon: 'Shield',
    features: [
      'Vulnerability assessment and penetration testing',
      'Security architecture design and review',
      'Identity and access management (IAM)',
      'Security operations center (SOC) setup',
      'Incident response planning and retainer',
      'Compliance (ISO 27001, SOC 2, GDPR, HIPAA)',
    ],
    benefits: [
      'Reduce risk of costly data breaches',
      'Achieve and maintain regulatory compliance',
      'Build customer trust with security-first practices',
      'Detect and respond to threats in real time',
    ],
    technologies: ['SIEM', 'EDR', 'Zero Trust', 'MFA', 'WAF', 'ZTNA', 'CrowdStrike', 'Microsoft Defender'],
    metaTitle: 'Cybersecurity Services & Solutions',
    metaDescription:
      'Orion eSolutions provides end-to-end cybersecurity — penetration testing, security architecture, SOC, and compliance to protect your business from evolving threats.',
  },
  {
    slug: 'data-analytics',
    title: 'Data & Analytics',
    shortDescription: 'Turn raw data into actionable insights with modern BI and analytics solutions.',
    description:
      'Data is your most valuable asset — if you can access and understand it. Orion eSolutions helps you build modern data platforms, implement business intelligence tools, and leverage machine learning to uncover insights that drive smarter business decisions.',
    icon: 'BarChart3',
    features: [
      'Data platform and data warehouse design',
      'Business intelligence (BI) and dashboards',
      'Data engineering and ETL pipeline development',
      'Machine learning and predictive analytics',
      'Real-time streaming analytics',
      'Data governance and quality management',
    ],
    benefits: [
      'Make faster, more informed business decisions',
      'Identify new revenue opportunities through data insights',
      'Reduce operational costs with predictive maintenance',
      'Improve customer retention with behavioral analytics',
    ],
    technologies: ['Snowflake', 'BigQuery', 'Databricks', 'Apache Spark', 'dbt', 'Looker', 'Power BI', 'Python', 'SQL'],
    metaTitle: 'Data & Analytics Solutions',
    metaDescription:
      'Orion eSolutions builds modern data platforms, BI dashboards, and ML solutions that transform raw data into actionable insights for smarter business decisions.',
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
