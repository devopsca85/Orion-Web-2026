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

export async function createTechStack(formData: FormData) {
  await requireAdmin()
  await prisma.techStack.create({
    data: {
      name: (formData.get('name') as string) || '',
      logoUrl: (formData.get('logoUrl') as string) || '',
      category: (formData.get('category') as string) || 'Other',
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/tech-stack')
  revalidatePath('/')
  redirect('/admin/tech-stack?saved=1')
}

export async function updateTechStack(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.techStack.update({
    where: { id },
    data: {
      name: (formData.get('name') as string) || '',
      logoUrl: (formData.get('logoUrl') as string) || '',
      category: (formData.get('category') as string) || 'Other',
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/tech-stack')
  revalidatePath('/')
  redirect('/admin/tech-stack?saved=1')
}

export async function deleteTechStack(id: string) {
  await requireAdmin()
  await prisma.techStack.delete({ where: { id } })
  revalidatePath('/admin/tech-stack')
  revalidatePath('/')
}
