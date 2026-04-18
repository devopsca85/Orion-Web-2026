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

export interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'checkbox' | 'url'
  required: boolean
  placeholder?: string
  options?: string[]
}

function parseFields(raw: string): FormFieldConfig[] {
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export async function createForm(formData: FormData) {
  await requireAdmin()
  await prisma.form.create({
    data: {
      name: (formData.get('name') as string) || '',
      slug: (formData.get('slug') as string) || '',
      title: (formData.get('title') as string) || '',
      description: (formData.get('description') as string) || null,
      fields: parseFields((formData.get('fields') as string) || '[]'),
      submitLabel: (formData.get('submitLabel') as string) || 'Submit',
      successMsg: (formData.get('successMsg') as string) || "Thank you! We'll be in touch shortly.",
      notifyEmail: (formData.get('notifyEmail') as string) || null,
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/forms')
  redirect('/admin/forms?saved=1')
}

export async function updateForm(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.form.update({
    where: { id },
    data: {
      name: (formData.get('name') as string) || '',
      slug: (formData.get('slug') as string) || '',
      title: (formData.get('title') as string) || '',
      description: (formData.get('description') as string) || null,
      fields: parseFields((formData.get('fields') as string) || '[]'),
      submitLabel: (formData.get('submitLabel') as string) || 'Submit',
      successMsg: (formData.get('successMsg') as string) || "Thank you! We'll be in touch shortly.",
      notifyEmail: (formData.get('notifyEmail') as string) || null,
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/forms')
  redirect('/admin/forms?saved=1')
}

export async function deleteForm(id: string) {
  await requireAdmin()
  await prisma.form.delete({ where: { id } })
  revalidatePath('/admin/forms')
}
