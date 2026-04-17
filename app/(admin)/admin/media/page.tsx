import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { MediaGrid } from '@/components/admin/MediaGrid'
import fs from 'fs'
import path from 'path'

interface MediaFile {
  name: string
  path: string
  folder: string
  ext: string
}

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.ico'])

function walkDir(dir: string, baseDir: string, folder: string): MediaFile[] {
  const files: MediaFile[] = []
  let entries: fs.Dirent[] = []
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subFolder = folder ? `${folder}/${entry.name}` : entry.name
      files.push(...walkDir(path.join(dir, entry.name), baseDir, subFolder))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (imageExts.has(ext)) {
        const relativePath = path.join(folder, entry.name).replace(/\\/g, '/')
        files.push({
          name: entry.name,
          path: `/assets/images/${relativePath}`,
          folder,
          ext,
        })
      }
    }
  }
  return files
}

export default async function MediaPage() {
  const session = await auth()
  const imagesDir = path.join(process.cwd(), 'public', 'assets', 'images')
  const files = walkDir(imagesDir, imagesDir, '')
  const sorted = files.sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))

  return (
    <>
      <AdminTopBar title="Media Browser" user={session!.user} />
      <div className="p-6">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{files.length}</span> image{files.length !== 1 ? 's' : ''} in <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">public/assets/images</code>
          </p>
          <p className="text-xs text-slate-400 mt-1">Click &ldquo;Copy path&rdquo; to copy the public URL to clipboard.</p>
        </div>

        <MediaGrid files={sorted} />
      </div>
    </>
  )
}
