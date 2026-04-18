import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  let body: { parent?: string; name: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON.' }, { status: 400 })
  }

  const parent = (body.parent || '').replace(/\.\./g, '').replace(/^\/+/, '')
  const name = (body.name || '')
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-{2,}/g, '-')
    .toLowerCase()

  if (!name) return NextResponse.json({ message: 'Folder name is required.' }, { status: 422 })

  const dirPath = path.join(process.cwd(), 'public', 'assets', 'images', parent, name)

  try {
    await mkdir(dirPath, { recursive: true })
  } catch (err) {
    console.error('[Media Folder] mkdir error:', err)
    return NextResponse.json({ message: 'Failed to create folder.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, folder: parent ? `${parent}/${name}` : name })
}
