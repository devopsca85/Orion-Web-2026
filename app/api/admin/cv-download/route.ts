import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const filePath = req.nextUrl.searchParams.get('path') ?? ''
  const mode     = req.nextUrl.searchParams.get('mode') ?? 'download'

  // Security: normalize and restrict to uploads/cvs only
  const normalized = path.posix.normalize(filePath.replace(/\\/g, '/'))
  if (!normalized.startsWith('/assets/uploads/cvs/')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const ext = path.extname(normalized).toLowerCase()
  if (!['.pdf', '.docx'].includes(ext)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const absolute = path.join(process.cwd(), 'public', normalized)
  if (!fs.existsSync(absolute)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const bytes    = fs.readFileSync(absolute)
  const filename = path.basename(normalized)
  const contentType =
    ext === '.pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition':
        mode === 'view'
          ? `inline; filename="${filename}"`
          : `attachment; filename="${filename}"`,
      'Content-Length': String(bytes.length),
    },
  })
}
