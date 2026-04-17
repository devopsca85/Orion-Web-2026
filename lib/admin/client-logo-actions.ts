'use server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) throw new Error('Admins only')
}

export async function createClientLogo(formData: FormData) {
  await requireAdmin()
  await prisma.clientLogo.create({
    data: {
      name: (formData.get('name') as string) || '',
      logoUrl: (formData.get('logoUrl') as string) || '',
      href: (formData.get('href') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/client-logos')
  revalidatePath('/')
  redirect('/admin/client-logos?saved=1')
}

export async function updateClientLogo(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.clientLogo.update({
    where: { id },
    data: {
      name: (formData.get('name') as string) || '',
      logoUrl: (formData.get('logoUrl') as string) || '',
      href: (formData.get('href') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/client-logos')
  revalidatePath('/')
  redirect('/admin/client-logos?saved=1')
}

export async function deleteClientLogo(id: string) {
  await requireAdmin()
  await prisma.clientLogo.delete({ where: { id } })
  revalidatePath('/admin/client-logos')
  revalidatePath('/')
}
