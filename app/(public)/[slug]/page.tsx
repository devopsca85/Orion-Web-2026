import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import { extractClonedPage } from '@/lib/extract-cloned-page'
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

function isFullHtml(content: string) {
  const trimmed = content.trimStart().toLowerCase()
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let page = null
  try {
    page = await prisma.page.findFirst({ where: { slug, parentSlug: null } })
  } catch { notFound() }
  if (!page) notFound()

  const fullHtml = isFullHtml(page.content)
  const cloned   = fullHtml ? extractClonedPage(page.content) : null

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

      {cloned ? (
        // Full WP HTML — body + extracted styles render inline. WP chrome and
        // scripts are stripped so the site Header/Footer aren't doubled and
        // unreachable WP plugin endpoints don't error in console.
        <div className="cloned-page">
          {cloned.headHtml && <div dangerouslySetInnerHTML={{ __html: cloned.headHtml }} />}
          <div dangerouslySetInnerHTML={{ __html: cloned.bodyHtml }} />
        </div>
      ) : (
        <section className="py-16 md:py-24">
          <Container size={containerSize}>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
            <div
              className="prose prose-slate prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </Container>
        </section>
      )}

      {page.structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: page.structuredData }} />
      )}
    </>
  )
}
