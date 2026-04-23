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

export async function createAward(formData: FormData) {
  await requireAdmin()
  await prisma.award.create({
    data: {
      title: (formData.get('title') as string) || '',
      issuer: (formData.get('issuer') as string) || '',
      year: (formData.get('year') as string) ? parseInt(formData.get('year') as string) : null,
      logoUrl: (formData.get('logoUrl') as string) || null,
      description: (formData.get('description') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/awards')
  revalidatePath('/')
  redirect('/admin/awards?saved=1')
}

export async function updateAward(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.award.update({
    where: { id },
    data: {
      title: (formData.get('title') as string) || '',
      issuer: (formData.get('issuer') as string) || '',
      year: (formData.get('year') as string) ? parseInt(formData.get('year') as string) : null,
      logoUrl: (formData.get('logoUrl') as string) || null,
      description: (formData.get('description') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/awards')
  revalidatePath('/')
  redirect('/admin/awards?saved=1')
}

export async function deleteAward(id: string) {
  await requireAdmin()
  await prisma.award.delete({ where: { id } })
  revalidatePath('/admin/awards')
  revalidatePath('/')
}
