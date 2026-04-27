/**
 * Seed script — populates the homepage reference data from the live
 * orionesolutions.com homepage into the new CMS.
 *
 * Idempotent: each section runs deleteMany() then createMany() so re-running
 * the script will not duplicate rows.
 *
 * Covers: SiteStat, ClientLogo, Testimonial, FAQ, EngagementModel, TechStack.
 * Services are intentionally NOT touched here — use scripts/seed-services.ts.
 *
 * Image URLs point to orionesolutions.com for the initial run. After
 * `bash scripts/import-wp-images.sh` migrates them, swap to /assets/images/...
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-homepage.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── Stats (homepage stat cards) ───────────────────────────────────────────
const STATS = [
  { value: '03+',   label: 'Countries',         sortOrder: 1 },
  { value: '1250+', label: 'Projects Completed', sortOrder: 2 },
  { value: '160+',  label: 'Team Members',       sortOrder: 3 },
]

// ── Client logos (logo carousel) ──────────────────────────────────────────
const CLIENT_LOGOS = [
  { name: 'Infosys',       logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/infosys-1.png',       sortOrder: 1 },
  { name: 'Cook Boardman', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/cookBoardman-1.png', sortOrder: 2 },
  { name: 'Accenture',     logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/accebture.png',      sortOrder: 3 },
  { name: 'People Lenses', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/people-lenes.png',   sortOrder: 4 },
  { name: 'Genpact',       logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/genpact.png',        sortOrder: 5 },
  { name: 'Viz',           logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/viz.png',            sortOrder: 6 },
  { name: 'McKinsey',      logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/mckinsey.png',       sortOrder: 7 },
]

// ── Testimonials (10 entries from live testimonial slider) ───────────────
const TESTIMONIALS = [
  {
    name:    'Reel Trail',
    title:   'Verified Client',
    company: 'Reel Trail',
    quote:   'Highly recommended. Great communication. Great skill set. Incredible job. Always ready to work and work efficiently and effectively. This is the best web design company in India. Thank you very much. Will hire again. Great development team.',
    sortOrder: 1,
  },
  {
    name:    'Upwork Client',
    title:   'ASP.NET / MVC Project',
    company: 'Upwork',
    quote:   'I have worked with a lot of freelancers on Elance and Upwork and can claim that Orion eSolutions has one of the best developers. Their skills speak for themselves and they have great knowledge in ASP.NET and MVC. We were scared to outsource our work to an unknown company but I can say that we made the right choice.',
    sortOrder: 2,
  },
  {
    name:    'Crockett Dunn, LLC',
    title:   'DevOps and Cloud Support',
    company: 'Crockett Dunn, LLC',
    quote:   'Orion eSolutions brought a task-oriented focus to a technical job where leadership and focus were badly needed.',
    sortOrder: 3,
  },
  {
    name:    'Omnium Group Corporation',
    title:   'DevOps and Cloud Support',
    company: 'Omnium Group Corporation',
    quote:   'Orion eSolutions was a great team to work with. They had wonderful communication and a great command of AWS/Azure.',
    sortOrder: 4,
  },
  {
    name:    'Mark',
    title:   'DevOps and Cloud Support',
    company: 'Independent',
    quote:   "Amazing job. Very honest, trustworthy and best of all - great at what he does. Hire this freelancer right now you'll be happy you did.",
    sortOrder: 5,
  },
  {
    name:    'Upwork Client',
    title:   'Web Application Project',
    company: 'Upwork',
    quote:   'Orion eSolutions started a project from my vision. Not only did they get off on the right track, but they would create features that I had not considered, and the application evolved into something much better than I thought it could! That is why they are the best website development company in India.',
    sortOrder: 6,
  },
  {
    name:    'Upwork Client',
    title:   'First-time Outsourcing',
    company: 'Upwork',
    quote:   "We weren't sure what to expect from Upwork, but Orion eSolutions was a great first experience. The Skype call at the beginning of the project was very helpful, and general communication was excellent throughout. The work received from Orion was also of good quality.",
    sortOrder: 7,
  },
  {
    name:    'Andrew Carlson',
    title:   'DevOps and Cloud Support',
    company: 'Independent',
    quote:   'Absolute pleasure to work with Orion eSolutions. Will hire again ASAP!',
    sortOrder: 8,
  },
  {
    name:    'Tellarc',
    title:   'DevOps and Cloud Support',
    company: 'Tellarc',
    quote:   'Orion eSolutions worked with us briefly on a project that was a very big deliverable. Throughout the process they communicated regularly. The Orion team is very knowledgeable about the subject area we used them for — Proxmox — with confidence.',
    sortOrder: 9,
  },
  {
    name:    'Peter Fauland',
    title:   'Rapid Delivery',
    company: 'Independent',
    quote:   "Did you ever try to do 'the impossible' within a time frame of just one week? We got a recommendation from a colleague to call the guys at Orion eSolutions. We did, and now we have our system up and running exactly according to our specifications. That's why this is the best website development company in India.",
    sortOrder: 10,
  },
]

// ── FAQs (7 entries from FAQ accordion) ──────────────────────────────────
const FAQS = [
  {
    question:  'What services does Orion eSolutions offer?',
    answer:    'Orion eSolutions provides end-to-end digital solutions, including software development, mobile and web app development, AI/ML integration, DevOps, and IT consulting for businesses of all sizes.',
    category:  'Services',
    sortOrder: 1,
  },
  {
    question:  'Can you integrate AI or machine learning into our existing software?',
    answer:    'Yes, we specialize in AI/ML integration and can enhance your current systems with intelligent automation, predictive analytics, and custom AI agents.',
    category:  'AI',
    sortOrder: 2,
  },
  {
    question:  'How long does it take to build custom software?',
    answer:    'Timeline varies with complexity — basic projects may take a few weeks, while full-scale systems can take several months or more. Simple apps: 6-8 weeks; larger solutions: 3-9+ months.',
    category:  'Process',
    sortOrder: 3,
  },
  {
    question:  'What is the typical software development process?',
    answer:    'We follow a structured process: requirements gathering, design & prototyping, development, testing (QA), deployment, and post-launch maintenance. We keep you in the loop at each stage.',
    category:  'Process',
    sortOrder: 4,
  },
  {
    question:  'Do you offer post-launch support and maintenance?',
    answer:    'Yes — we provide ongoing maintenance, updates, bug fixes, and new-feature development under flexible support plans. Your software stays secure and evolving.',
    category:  'Support',
    sortOrder: 5,
  },
  {
    question:  'What benefits does AI integration bring to my business?',
    answer:    'AI adds automation, predictive insights, personalization, and operational efficiency. We design AI/ML models that bring real-world value to your workflows.',
    category:  'AI',
    sortOrder: 6,
  },
  {
    question:  'How can I get started with Orion eSolutions?',
    answer:    "Simply fill out the contact form or schedule a consultation. We'll discuss your goals, understand your challenges, and recommend a tailored digital solution.",
    category:  'Getting Started',
    sortOrder: 7,
  },
]

// ── Engagement Models (2 entries) ────────────────────────────────────────
const ENGAGEMENT_MODELS = [
  {
    title:       'On-Demand App & Web Development',
    description: 'To assist you in taking your project from concept to launch, we specialise in Mobile and Web App Development, ERP Implementation and Custom Applications.',
    features:    [
      'Mobile App Development',
      'Web App Development',
      'ERP Implementation',
      'Custom Applications',
      'Concept-to-launch delivery',
    ],
    icon:      'rocket',
    sortOrder: 1,
  },
  {
    title:       'Remote Development Team',
    description: 'We help you create tech-savvy teams with top talent. You can lead teams with advanced skills to boost productivity. We have aided global brands and startups of all sizes find the right tech talent.',
    features:    [
      'Pre-vetted developers',
      'Flexible team scaling',
      'Direct team management',
      'Global time-zone coverage',
      'Long-term engagement support',
    ],
    icon:      'users',
    sortOrder: 2,
  },
]

// ── Tech Stack (categorised grid) ────────────────────────────────────────
const TECH_STACK = [
  // Backend
  { name: 'Java',            category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-java1.png',         sortOrder: 1 },
  { name: 'Node.js',         category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/NodeJs.png',                sortOrder: 2 },
  { name: 'Python',          category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/Python.png',                sortOrder: 3 },
  { name: 'PHP',             category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/php.png',                   sortOrder: 4 },
  { name: 'ASP.NET',         category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/ASP.net_.png',              sortOrder: 5 },
  { name: '.NET Core',       category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/Dotnet-Core.png',           sortOrder: 6 },
  { name: 'Ruby on Rails',   category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/Ruby-on-Rails.png',         sortOrder: 7 },
  { name: 'SQL Databases',   category: 'Backend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/SQL-Databases.png',         sortOrder: 8 },

  // Frontend
  { name: 'React',           category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-react-js1.png',   sortOrder: 1 },
  { name: 'Angular',         category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-angular-js1.png', sortOrder: 2 },
  { name: 'Vue.js',          category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/Vue.js.png',               sortOrder: 3 },
  { name: 'JavaScript',      category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/JavaScript.png',           sortOrder: 4 },
  { name: 'HTML5',           category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-html51.png',      sortOrder: 5 },
  { name: 'CSS3',            category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-css31.png',       sortOrder: 6 },
  { name: 'jQuery',          category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-jquery1.png',     sortOrder: 7 },
  { name: 'PWA',             category: 'Frontend', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-pwa1.png',        sortOrder: 8 },

  // Cloud
  { name: 'AWS',             category: 'Cloud', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/AWS.png',                            sortOrder: 1 },
  { name: 'Microsoft Azure', category: 'Cloud', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-microsoft-azure1.png',     sortOrder: 2 },
  { name: 'Google Cloud',    category: 'Cloud', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/Google-Cloud-Platform.png',         sortOrder: 3 },
  { name: 'Docker',          category: 'Cloud', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2024/03/location-docker.png',               sortOrder: 4 },
  { name: 'Kubernetes',      category: 'Cloud', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2024/03/location-kubernetes.png',           sortOrder: 5 },

  // Mobile
  { name: 'React Native',    category: 'Mobile', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-cross-platform1.png',     sortOrder: 1 },
  { name: 'Ionic',           category: 'Mobile', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-ionic1.png',              sortOrder: 2 },
  { name: 'Native Apps',     category: 'Mobile', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-native-app-development1.png', sortOrder: 3 },

  // Ecommerce
  { name: 'Magento',         category: 'Ecommerce', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-magento1.png',         sortOrder: 1 },
  { name: 'Shopify',         category: 'Ecommerce', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-shopify1.png',         sortOrder: 2 },
  { name: 'Shopware',        category: 'Ecommerce', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-shopware1.png',        sortOrder: 3 },
  { name: 'CS-Cart',         category: 'Ecommerce', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-cs-cart1.png',         sortOrder: 4 },

  // QA
  { name: 'Automated Testing',   category: 'QA', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/location-automated-testing1.png', sortOrder: 1 },
  { name: 'Manual Testing',      category: 'QA', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/05/location-manual-testing1.png',    sortOrder: 2 },
  { name: 'Performance Testing', category: 'QA', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-performance-testing1.png', sortOrder: 3 },
  { name: 'Security Testing',    category: 'QA', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-security-testing1.png',   sortOrder: 4 },

  // UX
  { name: 'UX Design',           category: 'UX', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-ui-design1.png',          sortOrder: 1 },
  { name: 'Prototyping',         category: 'UX', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-prototypingandwireframing1.png', sortOrder: 2 },
  { name: 'Design Thinking',     category: 'UX', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-designthinking1.png',     sortOrder: 3 },
  { name: 'User Testing',        category: 'UX', logoUrl: 'https://orionesolutions.com/wp-content/uploads/2025/06/location-UserTesting1.png',        sortOrder: 4 },
]

async function seedSiteStats() {
  const deleted = await prisma.siteStat.deleteMany()
  await prisma.siteStat.createMany({ data: STATS })
  console.log(`   📊 SiteStat — deleted ${deleted.count}, inserted ${STATS.length}`)
}

async function seedClientLogos() {
  const deleted = await prisma.clientLogo.deleteMany()
  await prisma.clientLogo.createMany({ data: CLIENT_LOGOS })
  console.log(`   🏢 ClientLogo — deleted ${deleted.count}, inserted ${CLIENT_LOGOS.length}`)
}

async function seedTestimonials() {
  const deleted = await prisma.testimonial.deleteMany()
  await prisma.testimonial.createMany({ data: TESTIMONIALS })
  console.log(`   💬 Testimonial — deleted ${deleted.count}, inserted ${TESTIMONIALS.length}`)
}

async function seedFAQs() {
  const deleted = await prisma.fAQ.deleteMany()
  await prisma.fAQ.createMany({ data: FAQS })
  console.log(`   ❓ FAQ — deleted ${deleted.count}, inserted ${FAQS.length}`)
}

async function seedEngagementModels() {
  const deleted = await prisma.engagementModel.deleteMany()
  for (const m of ENGAGEMENT_MODELS) {
    await prisma.engagementModel.create({ data: m })
  }
  console.log(`   🤝 EngagementModel — deleted ${deleted.count}, inserted ${ENGAGEMENT_MODELS.length}`)
}

async function seedTechStack() {
  const deleted = await prisma.techStack.deleteMany()
  await prisma.techStack.createMany({ data: TECH_STACK })
  console.log(`   ⚙️  TechStack — deleted ${deleted.count}, inserted ${TECH_STACK.length}`)
}

async function main() {
  console.log('🌱 Seeding orionesolutions.com homepage data…\n')
  await seedSiteStats()
  await seedClientLogos()
  await seedTestimonials()
  await seedFAQs()
  await seedEngagementModels()
  await seedTechStack()
  console.log('\n✅ Done — visit http://localhost:3000 to verify.')
  console.log('💡 Tip: run `bash scripts/import-wp-images.sh` then update logoUrl paths to /assets/images/...')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
