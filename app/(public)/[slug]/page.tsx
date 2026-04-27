import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const page = await prisma.page.findFirst({ where: { slug, parentSlug: null } })
    if (!page) return {}
    return {
      title: page.metaTitle || page.title,
      description: page.metaDesc || page.excerpt || undefined,
      robots: page.noIndex ? { index: false, follow: true } : undefined,
      alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
      openGraph: {
        title: page.ogTitle || page.metaTitle || page.title,
        description: page.ogDescription || page.metaDesc || page.excerpt || undefined,
        images: page.ogImage ? [page.ogImage] : undefined,
      },
    }
  } catch { return {} }
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let page = null
  let sections: Awaited<ReturnType<typeof prisma.page.findMany>> = []
  try {
    page = await prisma.page.findFirst({ where: { slug, parentSlug: null } })
    if (page) {
      sections = await prisma.page.findMany({
        where: { parentSlug: slug, status: 'PUBLISHED' },
        orderBy: { sortOrder: 'asc' },
      })
    }
  } catch { notFound() }
  if (!page) notFound()

  const containerSize =
    page.template === 'narrow'
      ? 'sm'
      : page.template === 'full-width'
      ? 'xl'
      : 'md'

  return (
    <>
      {page.status !== 'PUBLISHED' && (
        <div className="bg-amber-400 text-amber-900 text-sm font-medium text-center py-2 px-4">
          Preview — this page is <strong>{page.status.toLowerCase()}</strong> and not visible to the public until published.
        </div>
      )}

      <section className="py-16 md:py-24">
        <Container size={containerSize}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
          {page.content && (
            <div
              className="prose prose-slate prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}
        </Container>
      </section>

      {sections.map((s) => {
        const size = s.template === 'narrow' ? 'sm' : s.template === 'full-width' ? 'xl' : 'md'
        return (
          <section key={s.id} className="py-12 md:py-16">
            <Container size={size}>
              {s.title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{s.title}</h2>
              )}
              <div
                className="prose prose-slate prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: s.content }}
              />
            </Container>
          </section>
        )
      })}

      {page.structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: page.structuredData }} />
      )}
    </>
  )
}
