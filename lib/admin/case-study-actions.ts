'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100)
}

export async function createCaseStudy(formData: FormData) {
  await requireAdmin()
  const title = String(formData.get('title') ?? '').trim()
  const slug  = slugify(String(formData.get('slug') ?? '') || title)
  await prisma.caseStudy.create({
    data: {
      slug,
      title,
      client:      String(formData.get('client') ?? ''),
      industry:    String(formData.get('industry') ?? ''),
      service:     String(formData.get('service') ?? '') || null,
      summary:     String(formData.get('summary') ?? ''),
      challenge:   String(formData.get('challenge') ?? ''),
      solution:    String(formData.get('solution') ?? ''),
      results:     String(formData.get('results') ?? ''),
      imageUrl:    String(formData.get('imageUrl') ?? '') || null,
      featured:    formData.get('featured') === 'on',
      published:   formData.get('published') === 'on',
      sortOrder:   parseInt(String(formData.get('sortOrder') ?? '0')) || 0,
    },
  })
  revalidatePath('/admin/case-studies')
  redirect('/admin/case-studies')
}

export async function updateCaseStudy(id: string, formData: FormData) {
  await requireAdmin()
  const newSlugRaw = (formData.get('slug') as string || '').trim()
  const newSlug = newSlugRaw ? newSlugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : undefined
  await prisma.caseStudy.update({
    where: { id },
    data: {
      ...(newSlug ? { slug: newSlug } : {}),
      title:     String(formData.get('title') ?? ''),
      client:    String(formData.get('client') ?? ''),
      industry:  String(formData.get('industry') ?? ''),
      service:   String(formData.get('service') ?? '') || null,
      summary:   String(formData.get('summary') ?? ''),
      challenge: String(formData.get('challenge') ?? ''),
      solution:  String(formData.get('solution') ?? ''),
      results:   String(formData.get('results') ?? ''),
      imageUrl:  String(formData.get('imageUrl') ?? '') || null,
      featured:  formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
      sortOrder: parseInt(String(formData.get('sortOrder') ?? '0')) || 0,
    },
  })
  revalidatePath('/admin/case-studies')
  redirect('/admin/case-studies')
}

export async function deleteCaseStudy(id: string) {
  await requireAdmin()
  await prisma.caseStudy.delete({ where: { id } })
  revalidatePath('/admin/case-studies')
}
