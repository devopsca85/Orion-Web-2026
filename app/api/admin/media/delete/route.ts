import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { resolveMediaPath } from '@/lib/media'

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  let body: { path?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const absPath = resolveMediaPath(body.path ?? '')
  if (!absPath) return NextResponse.json({ message: 'Invalid path.' }, { status: 400 })

  try {
    await unlink(absPath)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ message: 'File not found.' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to delete file.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
