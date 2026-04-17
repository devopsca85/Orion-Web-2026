export interface Partner {
  slug: string;
  name: string;
  tier: 'premier' | 'advanced' | 'standard';
  category: 'cloud' | 'crm' | 'erp' | 'security' | 'data' | 'devops';
  description: string;
  competencies: string[];
  logo: string;
}

export const partners: Partner[] = [
  { slug: 'aws', name: 'Amazon Web Services', tier: 'premier', category: 'cloud', description: 'AWS Premier Consulting Partner with competencies in Migration, DevOps, and Data & Analytics. We have delivered 100+ AWS migrations and build cloud-native solutions on the full AWS stack.', competencies: ['Migration', 'DevOps', 'Data & Analytics', 'Security', 'Well-Architected'], logo: '/assets/images/partners/aws.svg' },
  { slug: 'microsoft-azure', name: 'Microsoft Azure', tier: 'premier', category: 'cloud', description: 'Microsoft Gold Partner with Azure Expert MSP designation. Deep expertise in Azure infrastructure, Azure AI, Microsoft 365, and Dynamics 365 implementation.', competencies: ['Azure Expert MSP', 'Azure AI', 'Cloud Platform', 'Dynamics 365', 'Modern Workplace'], logo: '/assets/images/partners/azure.svg' },
  { slug: 'google-cloud', name: 'Google Cloud', tier: 'advanced', category: 'cloud', description: 'Google Cloud Partner with specializations in data analytics, machine learning, and application modernization using GCP services.', competencies: ['Data Analytics', 'Machine Learning', 'Application Modernization', 'Infrastructure'], logo: '/assets/images/partners/gcp.svg' },
  { slug: 'salesforce', name: 'Salesforce', tier: 'advanced', category: 'crm', description: 'Salesforce Consulting Partner specializing in Sales Cloud, Service Cloud, Marketing Cloud, and custom Salesforce application development.', competencies: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Experience Cloud', 'MuleSoft'], logo: '/assets/images/partners/salesforce.svg' },
  { slug: 'snowflake', name: 'Snowflake', tier: 'advanced', category: 'data', description: 'Snowflake Elite Services Partner. We design, build, and optimize Snowflake data platforms for enterprise analytics workloads.', competencies: ['Data Engineering', 'Data Sharing', 'Snowpark', 'Data Marketplace'], logo: '/assets/images/partners/snowflake.svg' },
  { slug: 'databricks', name: 'Databricks', tier: 'standard', category: 'data', description: 'Databricks Partner specializing in lakehouse architecture, Apache Spark optimization, and MLflow-powered machine learning pipelines.', competencies: ['Delta Lake', 'MLflow', 'Lakehouse', 'Streaming Analytics'], logo: '/assets/images/partners/databricks.svg' },
  { slug: 'crowdstrike', name: 'CrowdStrike', tier: 'standard', category: 'security', description: 'CrowdStrike Authorized Services Partner for Falcon platform deployment, endpoint detection and response (EDR), and managed security services.', competencies: ['Falcon EDR', 'Threat Intelligence', 'Incident Response', 'Managed Detection'], logo: '/assets/images/partners/crowdstrike.svg' },
  { slug: 'hashicorp', name: 'HashiCorp', tier: 'standard', category: 'devops', description: 'HashiCorp Consulting Partner for Terraform, Vault, and Consul implementations. We manage infrastructure as code across multi-cloud environments.', competencies: ['Terraform', 'Vault', 'Consul', 'Nomad'], logo: '/assets/images/partners/hashicorp.svg' },
];

export const certifications = [
  { name: 'ISO 27001', description: 'Information Security Management System', year: '2019', logo: '/assets/images/certs/iso27001.svg' },
  { name: 'SOC 2 Type II', description: 'Security, Availability & Confidentiality', year: '2020', logo: '/assets/images/certs/soc2.svg' },
  { name: 'ISO 9001', description: 'Quality Management System', year: '2018', logo: '/assets/images/certs/iso9001.svg' },
  { name: 'CMMI Level 3', description: 'Capability Maturity Model Integration', year: '2021', logo: '/assets/images/certs/cmmi.svg' },
];
