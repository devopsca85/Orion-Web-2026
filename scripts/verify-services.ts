/**
 * Verify every service slug expected by the live sitemap has a row in
 * the Service table. Any missing slug means /services/<slug> will 404
 * after launch.
 *
 *   npm run verify:services
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Slugs the live WP sitemap publishes under /services/<slug>.
const EXPECTED = [
  'server-management',
  'cloud-consulting-services',
  'mobile-app-development',
  'software-development',
  'web-development',
  '24-7-server-administration',
  'azure-consulting-services',
  'devops-service-providers',
  'aws-cloud-consulting',
  'custom-app-development',
]

// WP slugs we 301 to a different new-CMS slug in next.config.ts.
// These won't have rows in the Service table — redirects handle them.
const REDIRECTS: Record<string, string> = {
  'mobile-app-development':     'mobile-application-development',
  'custom-app-development':     'custom-application-development',
  'devops-service-providers':   'devops-consulting',
  'cloud-consulting-services':  'cloud-services',
  'server-management':          'cloud-managed-services',
  '24-7-server-administration': 'cloud-managed-services',
  'azure-consulting-services':  'cloud-services',
  'aws-cloud-consulting':       'cloud-services',
}

async function main() {
  const rows = await prisma.service.findMany({ select: { slug: true } })
  const have = new Set(rows.map(r => r.slug))

  const present     = EXPECTED.filter(s =>  have.has(s))
  const redirected  = EXPECTED.filter(s => !have.has(s) && REDIRECTS[s] && have.has(REDIRECTS[s]))
  const missing     = EXPECTED.filter(s => !have.has(s) && !(REDIRECTS[s] && have.has(REDIRECTS[s])))
  const extras      = [...have].filter(s => !EXPECTED.includes(s))

  console.log(`\n📊 Service table check\n`)
  console.log(`   Total rows in DB:    ${rows.length}`)
  console.log(`   Expected:            ${EXPECTED.length}`)
  console.log(`   Matched directly:    ${present.length}`)
  console.log(`   Covered by redirect: ${redirected.length}`)
  console.log(`   Missing:             ${missing.length}`)
  console.log(`   Extras (in DB, not in sitemap): ${extras.length}\n`)

  if (present.length) {
    console.log(`✅ Present:`)
    present.forEach(s => console.log(`     /services/${s}`))
    console.log('')
  }
  if (redirected.length) {
    console.log(`🔁 Covered by 301 redirect (next.config.ts):`)
    redirected.forEach(s => console.log(`     /services/${s}  →  /services/${REDIRECTS[s]}`))
    console.log('')
  }
  if (missing.length) {
    console.log(`❌ Missing — these URLs will 404 after launch:`)
    missing.forEach(s => console.log(`     /services/${s}`))
    console.log(`\n   Fix: add rows to Service table via /admin/services or a seed script.\n`)
  }
  if (extras.length) {
    console.log(`ℹ️  Extras (fine, just not on the live site):`)
    extras.forEach(s => console.log(`     /services/${s}`))
    console.log('')
  }

  process.exit(missing.length === 0 ? 0 : 1)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
