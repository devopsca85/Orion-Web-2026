'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PostStatus } from '@prisma/client'

async function requireEditor() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  const allowed = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR']
  if (!allowed.includes(session.user.role)) throw new Error('Insufficient permissions')
}

export async function createPage(formData: FormData) {
  await requireEditor()
  const title = formData.get('title') as string
  const slugRaw = formData.get('slug') as string
  const slug = slugRaw || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  await prisma.page.create({
    data: {
      title,
      slug,
      content: formData.get('content') as string,
      excerpt: (formData.get('excerpt') as string) || null,
      status: (formData.get('status') as PostStatus) || PostStatus.DRAFT,
      template: (formData.get('template') as string) || 'default',
      metaTitle: (formData.get('metaTitle') as string) || null,
      metaDesc: (formData.get('metaDesc') as string) || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    },
  })
  revalidatePath('/admin/pages')
  redirect('/admin/pages')
}

export async function updatePage(id: string, formData: FormData) {
  await requireEditor()
  await prisma.page.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: (formData.get('excerpt') as string) || null,
      status: (formData.get('status') as PostStatus) || PostStatus.DRAFT,
      template: (formData.get('template') as string) || 'default',
      metaTitle: (formData.get('metaTitle') as string) || null,
      metaDesc: (formData.get('metaDesc') as string) || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    },
  })
  revalidatePath('/admin/pages')
  revalidatePath(`/${formData.get('slug')}`)
  redirect('/admin/pages')
}

export async function deletePage(id: string) {
  await requireEditor()
  await prisma.page.delete({ where: { id } })
  revalidatePath('/admin/pages')
}
