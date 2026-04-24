import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  const [posts, pages] = await Promise.all([
    prisma.blogPost.updateMany({
      where: { status: 'DRAFT', scheduledAt: { lte: now, not: null } },
      data:  { status: 'PUBLISHED', publishedAt: now },
    }),
    prisma.page.updateMany({
      where: { status: 'DRAFT', scheduledAt: { lte: now, not: null } },
      data:  { status: 'PUBLISHED' },
    }),
  ])

  if (posts.count > 0) { revalidatePath('/blog'); revalidatePath('/admin/blog') }
  if (pages.count > 0) { revalidatePath('/admin/pages') }

  return NextResponse.json({ published: { posts: posts.count, pages: pages.count }, at: now.toISOString() })
}
