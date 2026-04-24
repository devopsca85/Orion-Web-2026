import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ results: [] })

  const contains = { contains: q }

  const [posts, pages, portfolio, services] = await Promise.all([
    prisma.blogPost.findMany({ where: { title: contains }, select: { slug: true, title: true }, take: 5 }),
    prisma.page.findMany({ where: { title: contains }, select: { id: true, title: true }, take: 5 }),
    prisma.portfolioItem.findMany({ where: { title: contains }, select: { slug: true, title: true }, take: 5 }),
    prisma.service.findMany({ where: { title: contains }, select: { slug: true, title: true }, take: 5 }),
  ])

  const results = [
    ...posts.map((p)     => ({ id: `blog-${p.slug}`,      type: 'blog'      as const, title: p.title, href: `/admin/blog/${p.slug}` })),
    ...pages.map((p)     => ({ id: `page-${p.id}`,        type: 'page'      as const, title: p.title, href: `/admin/pages/${p.id}` })),
    ...portfolio.map((p) => ({ id: `port-${p.slug}`,      type: 'portfolio' as const, title: p.title, href: `/admin/portfolio/${p.slug}` })),
    ...services.map((s)  => ({ id: `svc-${s.slug}`,       type: 'service'   as const, title: s.title, href: `/admin/services/${s.slug}` })),
  ]

  return NextResponse.json({ results })
}
