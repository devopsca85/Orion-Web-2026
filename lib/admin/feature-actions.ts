'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

export async function saveFeatures(formData: FormData) {
  await requireAdmin()

  const ids    = formData.getAll('id')    as string[]
  const titles = formData.getAll('title') as string[]

  await prisma.$transaction(
    ids.map((id, i) => {
      const data = {
        title:       titles[i] ?? '',
        description: String(formData.getAll('description')[i] ?? ''),
        icon:        String(formData.getAll('icon')[i] ?? 'CheckCircle'),
        panel:       String(formData.getAll('panel')[i] ?? 'left'),
        sortOrder:   i,
        active:      formData.getAll('active').includes(id),
      }
      return id
        ? prisma.siteFeature.update({ where: { id: parseInt(id) }, data })
        : prisma.siteFeature.create({ data })
    })
  )

  revalidatePath('/')
  revalidatePath('/admin/features')
}

export async function addFeature(formData: FormData) {
  await requireAdmin()
  const count = await prisma.siteFeature.count()
  await prisma.siteFeature.create({
    data: {
      title:       String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      icon:        String(formData.get('icon') ?? 'CheckCircle'),
      panel:       String(formData.get('panel') ?? 'left'),
      sortOrder:   count,
      active:      true,
    },
  })
  revalidatePath('/admin/features')
  revalidatePath('/')
}

export async function deleteFeature(id: number) {
  await requireAdmin()
  await prisma.siteFeature.delete({ where: { id } })
  revalidatePath('/admin/features')
  revalidatePath('/')
}
