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

export async function createTestimonial(formData: FormData) {
  await requireAdmin()
  await prisma.testimonial.create({
    data: {
      name: (formData.get('name') as string) || '',
      title: (formData.get('title') as string) || '',
      company: (formData.get('company') as string) || '',
      quote: (formData.get('quote') as string) || '',
      avatar: (formData.get('avatar') as string) || null,
      rating: parseInt((formData.get('rating') as string) || '5'),
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  redirect('/admin/testimonials?saved=1')
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.testimonial.update({
    where: { id },
    data: {
      name: (formData.get('name') as string) || '',
      title: (formData.get('title') as string) || '',
      company: (formData.get('company') as string) || '',
      quote: (formData.get('quote') as string) || '',
      avatar: (formData.get('avatar') as string) || null,
      rating: parseInt((formData.get('rating') as string) || '5'),
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  redirect('/admin/testimonials?saved=1')
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
}
