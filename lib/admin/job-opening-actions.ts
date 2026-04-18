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

function parseRequirements(raw: string): string[] {
  return raw
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean)
}

export async function createJobOpening(formData: FormData) {
  await requireAdmin()
  await prisma.jobOpening.create({
    data: {
      title: (formData.get('title') as string) || '',
      department: (formData.get('department') as string) || '',
      location: (formData.get('location') as string) || '',
      type: (formData.get('type') as string) || 'Full-time',
      level: (formData.get('level') as string) || '',
      description: (formData.get('description') as string) || '',
      requirements: parseRequirements((formData.get('requirements') as string) || ''),
      salary: (formData.get('salary') as string) || null,
      active: formData.get('active') === 'on',
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
    },
  })
  revalidatePath('/admin/job-openings')
  revalidatePath('/careers')
  redirect('/admin/job-openings?saved=1')
}

export async function updateJobOpening(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.jobOpening.update({
    where: { id },
    data: {
      title: (formData.get('title') as string) || '',
      department: (formData.get('department') as string) || '',
      location: (formData.get('location') as string) || '',
      type: (formData.get('type') as string) || 'Full-time',
      level: (formData.get('level') as string) || '',
      description: (formData.get('description') as string) || '',
      requirements: parseRequirements((formData.get('requirements') as string) || ''),
      salary: (formData.get('salary') as string) || null,
      active: formData.get('active') === 'on',
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0'),
    },
  })
  revalidatePath('/admin/job-openings')
  revalidatePath('/careers')
  redirect('/admin/job-openings?saved=1')
}

export async function deleteJobOpening(id: string) {
  await requireAdmin()
  await prisma.jobOpening.delete({ where: { id } })
  revalidatePath('/admin/job-openings')
  revalidatePath('/careers')
}
