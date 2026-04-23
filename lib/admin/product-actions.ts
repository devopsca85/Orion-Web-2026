'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  const role = session.user.role
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'EDITOR') {
    throw new Error('Insufficient permissions')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJson(raw: string): any[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return raw.split('\n').map((f) => f.trim()).filter(Boolean)
  }
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const title = (formData.get('title') as string).trim()
  const slug  = slugify(title)

  await prisma.product.create({
    data: {
      slug,
      title,
      logoUrl:     (formData.get('logoUrl')     as string || '').trim() || null,
      redirectUrl: (formData.get('redirectUrl') as string || '').trim() || null,
      features:    [],
      published:   formData.get('published') === 'on',
      sortOrder:   parseInt(formData.get('sortOrder') as string || '0'),
    },
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  redirect('/admin/products')
}

export async function updateProduct(slug: string, formData: FormData) {
  await requireAdmin()
  const title = (formData.get('title') as string).trim()
  const newSlug = slugify(title) || slug
  await prisma.product.update({
    where: { slug },
    data: {
      slug:        newSlug,
      title,
      logoUrl:     (formData.get('logoUrl')     as string || '').trim() || null,
      redirectUrl: (formData.get('redirectUrl') as string || '').trim() || null,
      published:   formData.get('published') === 'on',
      sortOrder:   parseInt(formData.get('sortOrder') as string || '0'),
    },
  })

  revalidatePath('/admin/products')
  revalidatePath(`/products/${slug}`)
  revalidatePath('/products')
  redirect('/admin/products')
}

export async function deleteProduct(slug: string) {
  await requireAdmin()
  await prisma.product.delete({ where: { slug } })
  revalidatePath('/admin/products')
  revalidatePath('/products')
}
