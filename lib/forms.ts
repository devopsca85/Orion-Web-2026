import { prisma } from '@/lib/prisma'

export interface FormConfig {
  id: string
  title: string
  description: string | null
  fields: { name: string; label: string; type: string; required: boolean; placeholder?: string; options?: string[] }[]
  submitLabel: string
  successMsg: string
}

export async function getFormBySlug(slug: string): Promise<FormConfig | null> {
  try {
    const form = await prisma.form.findUnique({
      where: { slug, active: true },
      select: { id: true, title: true, description: true, fields: true, submitLabel: true, successMsg: true },
    })
    if (!form) return null
    return {
      ...form,
      fields: Array.isArray(form.fields)
        ? (form.fields as FormConfig['fields'])
        : [],
    }
  } catch {
    return null
  }
}
