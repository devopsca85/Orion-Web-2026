'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) throw new Error('Admins only')
}

export async function createFooterLink(formData: FormData) {
  await requireAdmin()
  await prisma.footerLink.create({
    data: {
      label: (formData.get('label') as string) || '',
      href: (formData.get('href') as string) || '',
      group: (formData.get('group') as string) || '',
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0', 10),
      active: formData.get('active') === 'true',
      openInNew: formData.get('openInNew') === 'true',
    },
  })
  revalidatePath('/admin/footer-links')
  revalidatePath('/', 'layout')
  redirect('/admin/footer-links?saved=1')
}

export async function updateFooterLink(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.footerLink.update({
    where: { id },
    data: {
      label: (formData.get('label') as string) || '',
      href: (formData.get('href') as string) || '',
      group: (formData.get('group') as string) || '',
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0', 10),
      active: formData.get('active') === 'true',
      openInNew: formData.get('openInNew') === 'true',
    },
  })
  revalidatePath('/admin/footer-links')
  revalidatePath('/', 'layout')
  redirect('/admin/footer-links?saved=1')
}

export async function deleteFooterLink(id: string) {
  await requireAdmin()
  await prisma.footerLink.delete({ where: { id } })
  revalidatePath('/admin/footer-links')
  revalidatePath('/', 'layout')
}
