import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { NAV_LINKS, type NavLink, type NavLinkMega, type NavLinkDropdown, type NavLinkProductMega } from '@/lib/constants'

type DbNavItem = {
  id: string; label: string; href: string; parentId: string | null
  type: string; sortOrder: number; cardDesc: string | null; logoUrl: string | null
}

function buildNavFromDb(items: DbNavItem[]): NavLink[] {
  const byParent = new Map<string | null, DbNavItem[]>()
  for (const item of items) {
    const key = item.parentId
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key)!.push(item)
  }
  const topLevel = byParent.get(null) ?? []
  return topLevel.map((item): NavLink => {
    if (item.type === 'mega') {
      const groups = byParent.get(item.id) ?? []
      return {
        label: item.label, href: item.href, mega: true,
        columns: groups.map(g => ({
          title: g.label, href: g.href,
          items: (byParent.get(g.id) ?? []).map(c => ({ label: c.label, href: c.href }))
        }))
      } satisfies NavLinkMega
    }
    if (item.type === 'productMega') {
      const products = byParent.get(item.id) ?? []
      return {
        label: item.label, href: item.href, productMega: true,
        items: products.map(p => ({
          label: p.label, href: p.href,
          description: p.cardDesc ?? '',
          logoUrl: p.logoUrl ?? '/assets/images/logo.png',
        }))
      } satisfies NavLinkProductMega
    }
    if (item.type === 'dropdown') {
      const kids = byParent.get(item.id) ?? []
      return { label: item.label, href: item.href, children: kids.map(c => ({ label: c.label, href: c.href })) } satisfies NavLinkDropdown
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
      return buildNavFromDb(items)
    } catch {
      return NAV_LINKS
    }
  },
  ['nav-links'],
  { revalidate: 300, tags: ['nav'] }
)
