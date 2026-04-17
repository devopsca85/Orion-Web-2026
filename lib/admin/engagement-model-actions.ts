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

function parseFeatures(raw: string): string[] {
  return raw.split('\n').map((f) => f.trim()).filter(Boolean)
}

export async function createEngagementModel(formData: FormData) {
  await requireAdmin()
  const features = parseFeatures((formData.get('features') as string) || '')
  await prisma.engagementModel.create({
    data: {
      title: (formData.get('title') as string) || '',
      description: (formData.get('description') as string) || '',
      features: features,
      icon: (formData.get('icon') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/engagement-models')
  revalidatePath('/')
  redirect('/admin/engagement-models?saved=1')
}

export async function updateEngagementModel(id: string, formData: FormData) {
  await requireAdmin()
  const features = parseFeatures((formData.get('features') as string) || '')
  await prisma.engagementModel.update({
    where: { id },
    data: {
      title: (formData.get('title') as string) || '',
      description: (formData.get('description') as string) || '',
      features: features,
      icon: (formData.get('icon') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/engagement-models')
  revalidatePath('/')
  redirect('/admin/engagement-models?saved=1')
}

export async function deleteEngagementModel(id: string) {
  await requireAdmin()
  await prisma.engagementModel.delete({ where: { id } })
  revalidatePath('/admin/engagement-models')
  revalidatePath('/')
}
