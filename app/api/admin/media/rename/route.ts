import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { rename } from 'fs/promises'
import path from 'path'
import { resolveMediaPath, getImagesDir } from '@/lib/media'

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  let body: { path?: string; newName?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const absPath = resolveMediaPath(body.path ?? '')
  if (!absPath) return NextResponse.json({ message: 'Invalid path.' }, { status: 400 })

  const rawName = (body.newName ?? '').trim()
  if (!rawName) return NextResponse.json({ message: 'New name is required.' }, { status: 422 })

  const safeName = rawName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .toLowerCase()

  const dir = path.dirname(absPath)
  const newAbs = path.join(dir, safeName)

  const imagesDir = getImagesDir()
  if (!newAbs.startsWith(imagesDir + path.sep)) {
    return NextResponse.json({ message: 'Invalid destination.' }, { status: 400 })
  }

  try {
    await rename(absPath, newAbs)
  } catch {
    return NextResponse.json({ message: 'Failed to rename file.' }, { status: 500 })
  }

  const rel = path.relative(imagesDir, newAbs).replace(/\\/g, '/')
  return NextResponse.json({ success: true, path: `/assets/images/${rel}` })
}
