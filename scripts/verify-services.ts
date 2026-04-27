/**
 * Verify every service slug expected by the live sitemap has a row in
 * the Service table. Any missing slug means /services/<slug> will 404
 * after launch.
 *
 *   npm run verify:services
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

async function main() {
  const rows = await prisma.service.findMany({ select: { slug: true } })
  const have = new Set(rows.map(r => r.slug))

  const present = EXPECTED.filter(s =>  have.has(s))
  const missing = EXPECTED.filter(s => !have.has(s))
  const extras  = [...have].filter(s => !EXPECTED.includes(s))

  console.log(`\n📊 Service table check\n`)
  console.log(`   Total rows in DB: ${rows.length}`)
  console.log(`   Expected:         ${EXPECTED.length}`)
  console.log(`   Matched:          ${present.length}`)
  console.log(`   Missing:          ${missing.length}`)
  console.log(`   Extras (in DB, not in sitemap): ${extras.length}\n`)

  if (present.length) {
    console.log(`✅ Present:`)
    present.forEach(s => console.log(`     /services/${s}`))
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
