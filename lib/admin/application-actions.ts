'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApplicationStatus } from '@prisma/client'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) throw new Error('Admins only')
}

export async function updateApplication(id: string, formData: FormData) {
  await requireAdmin()
  const status = formData.get('status') as ApplicationStatus
  const notes = (formData.get('notes') as string).trim() || null
  const reviewedBy = (formData.get('reviewedBy') as string).trim() || null
  await prisma.jobApplication.update({
    where: { id },
    data: { status, notes, reviewedBy },
  })
  revalidatePath('/admin/applications')
  revalidatePath(`/admin/applications/${id}`)
  redirect(`/admin/applications/${id}?saved=1`)
}

export async function deleteApplication(id: string) {
  await requireAdmin()
  await prisma.jobApplication.delete({ where: { id } })
  revalidatePath('/admin/applications')
  redirect('/admin/applications?deleted=1')
}
