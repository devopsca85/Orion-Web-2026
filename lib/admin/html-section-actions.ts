'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireEditor() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  const allowed = ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
  if (!allowed.includes(session.user.role)) throw new Error('Insufficient permissions')
}

export async function createHtmlSection(formData: FormData) {
  await requireEditor()
  const pageSlug = (formData.get('pageSlug') as string).trim()
  await prisma.htmlSection.create({
    data: {
      pageSlug,
      name: (formData.get('name') as string).trim(),
      html: (formData.get('html') as string) || '',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/sections')
  revalidatePath(`/${pageSlug}`)
  revalidatePath('/')
  redirect('/admin/sections')
}

export async function updateHtmlSection(id: string, formData: FormData) {
  await requireEditor()
  const pageSlug = (formData.get('pageSlug') as string).trim()
  await prisma.htmlSection.update({
    where: { id },
    data: {
      pageSlug,
      name: (formData.get('name') as string).trim(),
      html: (formData.get('html') as string) || '',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/sections')
  revalidatePath(`/${pageSlug}`)
  revalidatePath('/')
  redirect('/admin/sections')
}

export async function deleteHtmlSection(id: string) {
  await requireEditor()
  const section = await prisma.htmlSection.findUnique({ where: { id } })
  await prisma.htmlSection.delete({ where: { id } })
  revalidatePath('/admin/sections')
  if (section) {
    revalidatePath(`/${section.pageSlug}`)
    revalidatePath('/')
  }
}

export async function toggleHtmlSection(id: string, active: boolean) {
  await requireEditor()
  const section = await prisma.htmlSection.update({
    where: { id },
    data: { active },
  })
  revalidatePath('/admin/sections')
  revalidatePath(`/${section.pageSlug}`)
  revalidatePath('/')
}
