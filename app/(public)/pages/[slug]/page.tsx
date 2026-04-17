import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return pages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug, status: 'PUBLISHED' } })
  if (!page) return {}
  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.excerpt || undefined,
  }
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug, status: 'PUBLISHED' } })
  if (!page) notFound()

  const containerSize =
    page.template === 'narrow'
      ? 'sm'
      : page.template === 'full-width'
      ? 'xl'
      : 'md'

  return (
    <section className="py-16 md:py-24">
      <Container size={containerSize}>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
        <div
          className="prose prose-slate prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </Container>
    </section>
  )
}
