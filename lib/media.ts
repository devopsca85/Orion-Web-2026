import 'server-only'
import fs from 'fs'
import path from 'path'
import type { MediaFile } from './media-types'

export type { MediaFile }

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.ico', '.pdf', '.mp4', '.mov'])

export function getImagesDir() {
  return path.join(process.cwd(), 'public', 'assets', 'images')
}

export function walkMedia(dir: string, folder = ''): MediaFile[] {
  const files: MediaFile[] = []
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch { return files }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const sub = folder ? `${folder}/${entry.name}` : entry.name
      files.push(...walkMedia(path.join(dir, entry.name), sub))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (!ALLOWED_EXTS.has(ext)) continue
      const absPath = path.join(dir, entry.name)
      let size = 0, uploadedAt = ''
      try {
        const stat = fs.statSync(absPath)
        size = stat.size
        uploadedAt = stat.mtime.toISOString()
      } catch {}
      const rel = folder ? `${folder}/${entry.name}` : entry.name
      files.push({ name: entry.name, path: `/assets/images/${rel}`, folder, ext, size, uploadedAt })
    }
  }
  return files
}

export function walkFolders(dir: string, prefix = ''): string[] {
  const result: string[] = []
  let entries: fs.Dirent[]
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return result }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const name = prefix ? `${prefix}/${entry.name}` : entry.name
      result.push(name)
      result.push(...walkFolders(path.join(dir, entry.name), name))
    }
  }
  return result
}

/** Resolves a public /assets/images/... path to an absolute fs path, or null if invalid. */
export function resolveMediaPath(publicPath: string): string | null {
  if (!publicPath.startsWith('/assets/images/')) return null
  const rel = publicPath.slice('/assets/images/'.length)
  if (!rel || rel.includes('..')) return null
  const abs = path.join(getImagesDir(), rel)
  if (!abs.startsWith(getImagesDir() + path.sep) && abs !== getImagesDir()) return null
  return abs
}
