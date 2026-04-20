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

export async function createCountryOffice(formData: FormData) {
  await requireAdmin()
  const flag = (formData.get('flag') as string).trim() || null
  await prisma.countryOffice.create({
    data: {
      country: (formData.get('country') as string) || '',
      flag: flag ? flag.slice(0, 512) : null,
      address: (formData.get('address') as string) || null,
      phone: (formData.get('phone') as string) || null,
      email: (formData.get('email') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0', 10),
      active: formData.get('active') === 'true',
    },
  })
  revalidatePath('/admin/country-offices')
  revalidatePath('/', 'layout')
  revalidatePath('/admin/country-offices')
  redirect('/admin/country-offices?saved=1')
}

export async function updateCountryOffice(id: string, formData: FormData) {
  await requireAdmin()
  const flag = (formData.get('flag') as string).trim() || null
  await prisma.countryOffice.update({
    where: { id },
    data: {
      country: (formData.get('country') as string) || '',
      flag: flag ? flag.slice(0, 512) : null,
      address: (formData.get('address') as string) || null,
      phone: (formData.get('phone') as string) || null,
      email: (formData.get('email') as string) || null,
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0', 10),
      active: formData.get('active') === 'true',
    },
  })
  revalidatePath('/admin/country-offices')
  revalidatePath('/', 'layout')
  redirect(`/admin/country-offices/${id}?saved=1`)
}

export async function deleteCountryOffice(id: string) {
  await requireAdmin()
  await prisma.countryOffice.delete({ where: { id } })
  revalidatePath('/admin/country-offices')
  revalidatePath('/', 'layout')
}
