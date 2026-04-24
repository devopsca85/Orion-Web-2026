import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { walkMedia, walkFolders, getImagesDir } from '@/lib/media'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const dir = getImagesDir()
  const files = walkMedia(dir).sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))
  const folders = Array.from(new Set([
    ...files.map((f) => f.folder).filter(Boolean),
    ...walkFolders(dir),
  ])).sort()

  return NextResponse.json({ files, folders })
}
