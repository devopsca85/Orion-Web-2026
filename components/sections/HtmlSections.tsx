import { prisma } from '@/lib/prisma'

interface Props {
  pageSlug: string
}

export async function HtmlSections({ pageSlug }: Props) {
  let sections: { id: string; html: string; name: string }[] = []
  try {
    sections = await prisma.htmlSection.findMany({
      where: { pageSlug, active: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, html: true, name: true },
    })
  } catch { return null }

  if (sections.length === 0) return null

  return (
    <>
      {sections.map((section) => (
        <div
          key={section.id}
          data-section={section.name}
          dangerouslySetInnerHTML={{ __html: section.html }}
        />
      ))}
    </>
  )
}
