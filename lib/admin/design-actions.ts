'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidateTag, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) throw new Error('Admins only')
}

export const DESIGN_KEYS = [
  'brand.primaryColor',
  'brand.secondaryColor',
  'brand.navColor',
  'brand.navBgColor',
  'brand.footerBgColor',
  'brand.headingColor',
  'brand.bodyTextColor',
  'brand.linkColor',
  'css.fontHeading',
  'css.fontBody',
  'css.fontHeadingWeight',
  'css.borderRadius',
  'css.containerMaxWidth',
  'css.sectionPadding',
  'css.custom',
]

export async function saveDesignSettings(formData: FormData) {
  await requireAdmin()
  await Promise.all(
    DESIGN_KEYS.map((key) => {
      const value = (formData.get(key) as string) ?? ''
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    })
  )
  revalidateTag('site-settings')
  revalidatePath('/admin/design')
  redirect('/admin/design?saved=1')
}

export async function getDesignSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: DESIGN_KEYS } } })
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}
