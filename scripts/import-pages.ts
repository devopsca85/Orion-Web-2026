#!/usr/bin/env tsx
/**
 * Bulk page importer — drop HTML files into scripts/pages/ then run:
 *   npx tsx scripts/import-pages.ts
 *
 * File naming: your-slug.html  (slug derived from filename)
 * Optional:    scripts/pages/manifest.json  for custom titles / templates
 *
 * Manifest format:
 * {
 *   "about-us": { "title": "About Us", "template": "default", "status": "PUBLISHED" },
 *   "privacy":  { "title": "Privacy Policy", "template": "narrow" }
 * }
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

function slugToTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

async function main() {
  const pagesDir = path.join(__dirname, 'pages')
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true })
    console.log('Created scripts/pages/ — drop your .html files in there and re-run.')
    return
  }

  // Load optional manifest
  const manifestPath = path.join(pagesDir, 'manifest.json')
  const manifest: Record<string, { title?: string; template?: string; status?: string }> =
    fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {}

  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'))
  if (files.length === 0) {
    console.log('No .html files found in scripts/pages/')
    return
  }

  console.log(`Found ${files.length} HTML file(s). Importing…\n`)
  let created = 0, skipped = 0, errors = 0

  for (const file of files) {
    const slug = path.basename(file, '.html')
    const meta = manifest[slug] ?? {}
    const title = meta.title || slugToTitle(slug)
    const template = meta.template || 'default'
    const status = (meta.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT'
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf8').trim()

    try {
      // Skip if slug already exists
      const existing = await prisma.page.findFirst({ where: { slug } })
      if (existing) {
        console.log(`  SKIP  ${slug}  (already exists, id: ${existing.id})`)
        skipped++
        continue
      }

      await prisma.page.create({
        data: { slug, title, content, template, status, sortOrder: 0 }
      })
      console.log(`  OK    ${slug}  → "${title}"  [${status}]`)
      created++
    } catch (err) {
      console.error(`  ERROR ${slug}: ${(err as Error).message}`)
      errors++
    }
  }

  console.log(`\nDone. Created: ${created}  Skipped: ${skipped}  Errors: ${errors}`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
