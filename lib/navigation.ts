import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { NAV_LINKS, type NavLink, type NavLinkMega, type NavLinkDropdown, type NavLinkProductMega } from '@/lib/constants'

type DbNavItem = {
  id: string; label: string; href: string; parentId: string | null
  type: string; sortOrder: number; cardDesc: string | null; logoUrl: string | null
}

async function getPublishedProducts(): Promise<NavLinkProductMega['items']> {
  try {
    const rows = await prisma.product.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      select: { slug: true, title: true, tagline: true, logoUrl: true },
    })
    return rows.map((p) => ({
      label: p.title,
      href: `/products/${p.slug}`,
      description: p.tagline ?? '',
      logoUrl: p.logoUrl ?? '/assets/images/logo.png',
    }))
  } catch {
    return []
  }
}

async function buildNavFromDb(navItems: DbNavItem[]): Promise<NavLink[]> {
  const byParent = new Map<string | null, DbNavItem[]>()
  for (const item of navItems) {
    const key = item.parentId
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key)!.push(item)
  }
  const topLevel = byParent.get(null) ?? []
  const dbProducts = await getPublishedProducts()

  return topLevel.map((item): NavLink => {
    if (item.type === 'mega') {
      const groups = byParent.get(item.id) ?? []
      return {
        label: item.label, href: item.href, mega: true,
        columns: groups.map((g) => ({
          title: g.label, href: g.href,
          items: (byParent.get(g.id) ?? []).map((c) => ({ label: c.label, href: c.href }))
        }))
      } satisfies NavLinkMega
    }
    if (item.type === 'productMega') {
      const productItems: NavLinkProductMega['items'] = dbProducts.length > 0
        ? dbProducts
        : (byParent.get(item.id) ?? []).map((p) => ({
            label: p.label, href: p.href,
            description: p.cardDesc ?? '',
            logoUrl: p.logoUrl ?? '/assets/images/logo.png',
          }))
      return { label: item.label, href: item.href, productMega: true, items: productItems } satisfies NavLinkProductMega
    }
    if (item.type === 'dropdown') {
      const kids = byParent.get(item.id) ?? []
      return { label: item.label, href: item.href, children: kids.map((c) => ({ label: c.label, href: c.href })) } satisfies NavLinkDropdown
    }
    return { label: item.label, href: item.href }
  })
}

export const getNavLinks = unstable_cache(
  async (): Promise<NavLink[]> => {
    try {
      const items = await prisma.navItem.findMany({
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, label: true, href: true, parentId: true, type: true, sortOrder: true, cardDesc: true, logoUrl: true },
      })
      if (items.length === 0) return NAV_LINKS
      return await buildNavFromDb(items)
    } catch {
      return NAV_LINKS
    }
  },
  ['nav-links'],
  { revalidate: 300, tags: ['nav'] }
)
