import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  if (isAdminPath && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|api/auth).*)'],
}
