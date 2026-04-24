'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function saveRevision(
  entityType: 'blog_post' | 'page',
  entityId: string,
  title: string,
  content: string,
) {
  const session = await auth()
  if (!session) return
  try {
    await prisma.revision.create({
      data: {
        entityType,
        entityId,
        title,
        content,
        editedBy: session.user.name ?? session.user.email ?? 'Unknown',
      },
    })
    // Keep only last 20 revisions per entity
    const all = await prisma.revision.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    if (all.length > 20) {
      const toDelete = all.slice(20).map((r) => r.id)
      await prisma.revision.deleteMany({ where: { id: { in: toDelete } } })
    }
  } catch { /* table not ready yet */ }
}

export async function restoreRevision(revisionId: string) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const revision = await prisma.revision.findUnique({ where: { id: revisionId } })
  if (!revision) throw new Error('Revision not found')

  if (revision.entityType === 'blog_post') {
    await prisma.blogPost.update({
      where: { slug: revision.entityId },
      data: { title: revision.title, content: revision.content },
    })
    revalidatePath(`/admin/blog/${revision.entityId}`)
    revalidatePath(`/blog/${revision.entityId}`)
    redirect(`/admin/blog/${revision.entityId}`)
  }

  if (revision.entityType === 'page') {
    await prisma.page.update({
      where: { id: revision.entityId },
      data: { title: revision.title, content: revision.content },
    })
    revalidatePath(`/admin/pages/${revision.entityId}`)
    redirect(`/admin/pages/${revision.entityId}`)
  }
}
