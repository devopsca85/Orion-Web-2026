'use server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) throw new Error('Admins only')
}

export async function saveBrandingSettings(formData: FormData) {
  await requireAdmin()
  const entries: { key: string; value: string }[] = [
    { key: 'logo.url', value: (formData.get('logo.url') as string) || '' },
    { key: 'logo.alt', value: (formData.get('logo.alt') as string) || '' },
    { key: 'brand.primaryColor', value: (formData.get('brand.primaryColor') as string) || '#1e3a8a' },
    { key: 'brand.secondaryColor', value: (formData.get('brand.secondaryColor') as string) || '#f97316' },
    { key: 'brand.navColor',       value: (formData.get('brand.navColor')       as string) || '#ffffff' },
    { key: 'brand.navBgColor',     value: (formData.get('brand.navBgColor')     as string) || '#1e3a8a' },
    { key: 'brand.companyName', value: (formData.get('brand.companyName') as string) || '' },
    { key: 'brand.tagline', value: (formData.get('brand.tagline') as string) || '' },
    { key: 'brand.footerCopyright', value: (formData.get('brand.footerCopyright') as string) || '' },
    { key: 'contact.phone', value: (formData.get('contact.phone') as string) || '' },
    { key: 'contact.email', value: (formData.get('contact.email') as string) || '' },
    { key: 'contact.address.street', value: (formData.get('contact.address.street') as string) || '' },
    { key: 'contact.address.city', value: (formData.get('contact.address.city') as string) || '' },
    { key: 'contact.address.state', value: (formData.get('contact.address.state') as string) || '' },
    { key: 'contact.address.zip', value: (formData.get('contact.address.zip') as string) || '' },
    { key: 'social.linkedin', value: (formData.get('social.linkedin') as string) || '' },
    { key: 'social.twitter', value: (formData.get('social.twitter') as string) || '' },
    { key: 'social.facebook', value: (formData.get('social.facebook') as string) || '' },
    { key: 'social.instagram', value: (formData.get('social.instagram') as string) || '' },
  ]

  for (const entry of entries) {
    await prisma.siteSetting.upsert({
      where: { key: entry.key },
      update: { value: entry.value },
      create: { key: entry.key, value: entry.value },
    })
  }

  revalidateTag('site-settings')
  revalidatePath('/', 'layout')
  redirect('/admin/branding?saved=1')
}

export async function saveContactSettings(formData: FormData) {
  await requireAdmin()
  const keys = ['contact.calendlyUrl']
  for (const key of keys) {
    const value = (formData.get(key) as string) || ''
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
  revalidateTag('site-settings')
  revalidatePath('/contact')
  redirect('/admin/contact-settings?saved=1')
}

export async function saveHomeSettings(formData: FormData) {
  await requireAdmin()
  const keys = [
    'home.hero.eyebrow',
    'home.hero.title',
    'home.hero.highlight',
    'home.hero.description',
    'home.hero.primaryCtaLabel',
    'home.hero.primaryCtaHref',
    'home.hero.secondaryCtaLabel',
    'home.hero.secondaryCtaHref',
    'home.hero.bullet1',
    'home.hero.bullet2',
    'home.hero.bullet3',
    'home.hero.backgroundImage',
    'home.hero.overlayOpacity',
  ]

  for (const key of keys) {
    const value = (formData.get(key) as string) || ''
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  revalidateTag('site-settings')
  revalidatePath('/')
  redirect('/admin/home?saved=1')
}
