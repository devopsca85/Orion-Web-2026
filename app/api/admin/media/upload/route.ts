import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.ico', '.pdf', '.mp4', '.mov'])
const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ message: 'Invalid form data.' }, { status: 400 })
  }

  const folder = ((formData.get('folder') as string) || '').replace(/\.\./g, '').replace(/^\/+/, '')
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ message: 'No file provided.' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ message: 'File exceeds 20 MB limit.' }, { status: 413 })

  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTS.has(ext)) {
    return NextResponse.json({ message: `File type ${ext} not allowed.` }, { status: 415 })
  }

  // Sanitise filename
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .toLowerCase()

  const destDir = path.join(process.cwd(), 'public', 'assets', 'images', folder)
  const destPath = path.join(destDir, safeName)

  try {
    await mkdir(destDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(destPath, buffer)
  } catch (err) {
    console.error('[Media Upload] Write error:', err)
    return NextResponse.json({ message: 'Failed to save file.' }, { status: 500 })
  }

  const publicPath = `/assets/images/${folder ? folder + '/' : ''}${safeName}`
  return NextResponse.json({ success: true, path: publicPath })
}
