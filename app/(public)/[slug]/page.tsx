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
    const page = await prisma.page.findFirst({ where: { slug } })
    if (!page) return {}
    return {
      title: page.metaTitle || page.title,
      description: page.metaDesc || page.excerpt || undefined,
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
    page = await prisma.page.findFirst({ where: { slug } })
  } catch { notFound() }
  if (!page) notFound()

  const fullHtml = isFullHtml(page.content)

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

      {fullHtml ? (
        /* Full HTML page — render in isolated iframe so custom styles/scripts work */
        <iframe
          srcDoc={page.content}
          style={{ width: '100%', border: 'none', display: 'block' }}
          className="full-html-frame"
          title={page.title}
          onLoad={undefined}
        />
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

      {fullHtml && (
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var frame = document.querySelector('.full-html-frame');
            if (!frame) return;
            function resize() {
              try {
                var h = frame.contentDocument && frame.contentDocument.body
                  ? frame.contentDocument.body.scrollHeight
                  : 0;
                if (h > 0) frame.style.height = h + 'px';
              } catch(e) {}
            }
            frame.addEventListener('load', function() {
              resize();
              // Re-check after fonts/images load
              setTimeout(resize, 500);
            });
          })();
        `}} />
      )}
    </>
  )
}
