'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

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
  const title = (formData.get('title') as string).trim()
  const slug  = ((formData.get('slug') as string) || '').trim() || slugify(title)

  await prisma.product.create({
    data: {
      slug,
      title,
      tagline:     (formData.get('tagline')     as string || '').trim(),
      description: (formData.get('description') as string || '').trim(),
      logoUrl:     (formData.get('logoUrl')     as string || '').trim() || null,
      features:    parseJson(formData.get('features') as string || '[]'),
      metaTitle:   (formData.get('metaTitle')   as string || '').trim() || null,
      metaDesc:    (formData.get('metaDesc')    as string || '').trim() || null,
      published:   formData.get('published') === 'on',
      sortOrder:   parseInt(formData.get('sortOrder') as string || '0'),
    },
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  redirect('/admin/products')
}

export async function updateProduct(slug: string, formData: FormData) {
  await prisma.product.update({
    where: { slug },
    data: {
      title:       (formData.get('title')       as string).trim(),
      tagline:     (formData.get('tagline')     as string || '').trim(),
      description: (formData.get('description') as string || '').trim(),
      logoUrl:     (formData.get('logoUrl')     as string || '').trim() || null,
      features:    parseJson(formData.get('features') as string || '[]'),
      metaTitle:   (formData.get('metaTitle')   as string || '').trim() || null,
      metaDesc:    (formData.get('metaDesc')    as string || '').trim() || null,
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
  await prisma.product.delete({ where: { slug } })
  revalidatePath('/admin/products')
  revalidatePath('/products')
}
