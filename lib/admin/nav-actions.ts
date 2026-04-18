'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NAV_LINKS, type NavLink, type NavLinkMega, type NavLinkDropdown, type NavLinkProductMega } from '@/lib/constants'

function isMega(l: NavLink): l is NavLinkMega { return 'mega' in l && (l as NavLinkMega).mega === true }
function isProductMega(l: NavLink): l is NavLinkProductMega { return 'productMega' in l && (l as NavLinkProductMega).productMega === true }
function isDropdown(l: NavLink): l is NavLinkDropdown { return 'children' in l }

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
}

export async function seedNavFromConstants() {
  await requireAdmin()
  await prisma.navItem.deleteMany()
  let order = 0
  for (const link of NAV_LINKS) {
    order++
    if (isMega(link)) {
      const parent = await prisma.navItem.create({ data: { label: link.label, href: link.href, type: 'mega', sortOrder: order } })
      let gOrder = 0
      for (const col of link.columns) {
        gOrder++
        const group = await prisma.navItem.create({ data: { label: col.title, href: col.href, type: 'megaGroup', parentId: parent.id, sortOrder: gOrder } })
        let iOrder = 0
        for (const item of col.items) { iOrder++; await prisma.navItem.create({ data: { label: item.label, href: item.href, type: 'link', parentId: group.id, sortOrder: iOrder } }) }
      }
    } else if (isProductMega(link)) {
      const parent = await prisma.navItem.create({ data: { label: link.label, href: link.href, type: 'productMega', sortOrder: order } })
      let cOrder = 0
      for (const card of link.items) { cOrder++; await prisma.navItem.create({ data: { label: card.label, href: card.href, type: 'productCard', parentId: parent.id, sortOrder: cOrder, cardDesc: card.description, logoUrl: card.logoUrl } }) }
    } else if (isDropdown(link)) {
      const parent = await prisma.navItem.create({ data: { label: link.label, href: link.href, type: 'dropdown', sortOrder: order } })
      let cOrder = 0
      for (const child of link.children) { cOrder++; await prisma.navItem.create({ data: { label: child.label, href: child.href, type: 'link', parentId: parent.id, sortOrder: cOrder } }) }
    } else {
      await prisma.navItem.create({ data: { label: link.label, href: link.href, type: 'link', sortOrder: order } })
    }
  }
  revalidateTag('nav')
  redirect('/admin/navigation')
}

export async function createNavItem(formData: FormData) {
  await requireAdmin()
  await prisma.navItem.create({
    data: {
      label: formData.get('label') as string,
      href: (formData.get('href') as string) || '#',
      type: (formData.get('type') as string) || 'link',
      parentId: (formData.get('parentId') as string) || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      active: formData.get('active') !== 'off',
      openInNew: formData.get('openInNew') === 'on',
      cardDesc: (formData.get('cardDesc') as string) || null,
      logoUrl: (formData.get('logoUrl') as string) || null,
    },
  })
  revalidateTag('nav')
  redirect('/admin/navigation')
}

export async function updateNavItem(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.navItem.update({
    where: { id },
    data: {
      label: formData.get('label') as string,
      href: (formData.get('href') as string) || '#',
      type: (formData.get('type') as string) || 'link',
      parentId: (formData.get('parentId') as string) || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      active: formData.get('active') === 'on',
      openInNew: formData.get('openInNew') === 'on',
      cardDesc: (formData.get('cardDesc') as string) || null,
      logoUrl: (formData.get('logoUrl') as string) || null,
    },
  })
  revalidateTag('nav')
  redirect('/admin/navigation')
}

export async function deleteNavItem(id: string) {
  await requireAdmin()
  await prisma.navItem.delete({ where: { id } })
  revalidateTag('nav')
}

export async function moveToTopLevel(id: string) {
  await requireAdmin()
  const last = await prisma.navItem.findFirst({ where: { parentId: null }, orderBy: { sortOrder: 'desc' } })
  await prisma.navItem.update({ where: { id }, data: { parentId: null, type: 'link', sortOrder: (last?.sortOrder ?? 0) + 1 } })
  revalidateTag('nav')
}
