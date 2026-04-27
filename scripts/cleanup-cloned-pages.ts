/**
 * Remove all Page rows that were created by the (now-deleted) clone-live-page
 * script. Identifies them by content starting with `<!doctype` or `<html` —
 * legitimate hand-authored Page rows store rich-text snippets, not full HTML
 * documents.
 *
 *   npm run cleanup:cloned             # dry run, prints what would be deleted
 *   npm run cleanup:cloned -- --apply  # actually deletes
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function isFullHtml(content: string | null | undefined): boolean {
  if (!content) return false
  const t = content.trimStart().toLowerCase()
  return t.startsWith('<!doctype') || t.startsWith('<html')
}

async function main() {
  const apply = process.argv.includes('--apply')

  const all  = await prisma.page.findMany({ select: { id: true, slug: true, title: true, content: true, parentSlug: true } })
  const dead = all.filter(p => isFullHtml(p.content))

  console.log(`\n📋 Page rows in DB: ${all.length}`)
  console.log(`   Cloned (full HTML, will be removed): ${dead.length}\n`)

  if (dead.length === 0) {
    console.log('Nothing to clean up.')
    return
  }

  for (const p of dead) {
    console.log(`   • /${p.slug}${p.parentSlug ? ` (section of /${p.parentSlug})` : ''} — ${p.title}`)
  }

  if (!apply) {
    console.log(`\nDry run. Re-run with --apply to actually delete these ${dead.length} rows.`)
    return
  }

  const ids = dead.map(p => p.id)
  const result = await prisma.page.deleteMany({ where: { id: { in: ids } } })
  console.log(`\n🧹 Deleted ${result.count} rows.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
