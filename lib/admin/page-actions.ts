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

function str(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string | null)?.trim()
  return v || null
}

function buildPageData(formData: FormData, isNew = false) {
  const title = formData.get('title') as string
  const slugRaw = str(formData, 'slug')
  const slug = slugRaw || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const parentSlug = str(formData, 'parentSlug')

  return {
    title,
    slug,
    content: (formData.get('content') as string) || '',
    excerpt: str(formData, 'excerpt'),
    status: (str(formData, 'status') as PostStatus) || PostStatus.DRAFT,
    template: str(formData, 'template') || 'default',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    parentSlug,
    // SEO
    metaTitle: str(formData, 'metaTitle'),
    metaDesc: str(formData, 'metaDesc'),
    ogTitle: str(formData, 'ogTitle'),
    ogDescription: str(formData, 'ogDescription'),
    ogImage: str(formData, 'ogImage'),
    canonicalUrl: str(formData, 'canonicalUrl'),
    noIndex: formData.get('noIndex') === 'on',
    structuredData: str(formData, 'structuredData'),
  }
}

function revalidateAll(slug: string, parentSlug: string | null) {
  revalidatePath('/admin/pages')
  revalidatePath(`/${slug}`)
  if (parentSlug) {
    revalidatePath(`/${parentSlug}`)
    revalidatePath('/')
  }
}

export async function createPage(formData: FormData) {
  await requireEditor()
  const data = buildPageData(formData, true)
  await prisma.page.create({ data })
  revalidateAll(data.slug, data.parentSlug)
  redirect('/admin/pages')
}

export async function updatePage(id: string, formData: FormData) {
  await requireEditor()
  const data = buildPageData(formData)
  await prisma.page.update({ where: { id }, data })
  revalidateAll(data.slug, data.parentSlug)
  redirect('/admin/pages')
}

export async function deletePage(id: string) {
  await requireEditor()
  const page = await prisma.page.findUnique({ where: { id } })
  await prisma.page.delete({ where: { id } })
  if (page) revalidateAll(page.slug, page.parentSlug)
}
