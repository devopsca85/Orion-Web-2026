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

export async function createFAQ(formData: FormData) {
  await requireAdmin()
  await prisma.fAQ.create({
    data: {
      question: (formData.get('question') as string) || '',
      answer: (formData.get('answer') as string) || '',
      category: (formData.get('category') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/faqs')
  revalidatePath('/')
  redirect('/admin/faqs?saved=1')
}

export async function updateFAQ(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.fAQ.update({
    where: { id },
    data: {
      question: (formData.get('question') as string) || '',
      answer: (formData.get('answer') as string) || '',
      category: (formData.get('category') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/faqs')
  revalidatePath('/')
  redirect('/admin/faqs?saved=1')
}

export async function deleteFAQ(id: string) {
  await requireAdmin()
  await prisma.fAQ.delete({ where: { id } })
  revalidatePath('/admin/faqs')
  revalidatePath('/')
}
