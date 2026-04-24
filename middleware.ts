import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getIp, isBlockedIp } from '@/lib/spam-guard'
import { canAccess } from '@/lib/role-permissions'
import type { Role } from '@/lib/role-permissions'

export const runtime = 'nodejs'

export default auth(async (req) => {
  // Block IPs at the edge before any page or API route is reached
  const ip = getIp(req)
  if (ip !== 'unknown' && ip !== '127.0.0.1') {
    if (await isBlockedIp(ip)) {
      return new NextResponse('Access denied.', { status: 403 })
    }
  }

  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  if (isAdminPath && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Role-based access control for authenticated admin users
  if (isAdminPath && !isLoginPage && req.auth) {
    const role = (req.auth as { user?: { role?: string } }).user?.role as Role | undefined
    if (role && !canAccess(role, pathname)) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|api/auth).*)'],
}
