export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR'

const HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  AUTHOR: 1,
}

// Routes requiring a minimum role (prefix-matched, first match wins)
const ROUTE_MIN_ROLE: Array<{ prefix: string; minRole: Role }> = [
  { prefix: '/admin/users',            minRole: 'SUPER_ADMIN' },
  { prefix: '/admin/security',         minRole: 'ADMIN' },
  { prefix: '/admin/email-settings',   minRole: 'ADMIN' },
  { prefix: '/admin/design',           minRole: 'ADMIN' },
  { prefix: '/admin/branding',         minRole: 'ADMIN' },
  { prefix: '/admin/contact-settings', minRole: 'ADMIN' },
]

// Routes AUTHOR role may access (exact or prefix)
const AUTHOR_ALLOWED_PREFIXES = [
  '/admin/blog',
  '/admin/media',
]

export function canAccess(role: Role, pathname: string): boolean {
  const rank = HIERARCHY[role] ?? 0

  // ADMIN and above: full access everywhere
  if (rank >= 3) return true

  // Check specific restricted routes
  for (const req of ROUTE_MIN_ROLE) {
    if (pathname.startsWith(req.prefix)) {
      return rank >= HIERARCHY[req.minRole]
    }
  }

  // EDITOR: access to everything not restricted above
  if (role === 'EDITOR') return true

  // AUTHOR: only dashboard + allowed prefixes
  if (role === 'AUTHOR') {
    if (pathname === '/admin') return true
    return AUTHOR_ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
  }

  return false
}

/** Items in navGroups that this role can see */
export function filterNavItems<T extends { href: string }>(role: Role, items: T[]): T[] {
  return items.filter((item) => canAccess(role, item.href))
}
