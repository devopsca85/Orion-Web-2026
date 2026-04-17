import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// IP allowlist for admin routes (if any admin routes are added later)
const ADMIN_IP_ALLOWLIST = (process.env.ADMIN_IP_ALLOWLIST || '')
  .split(',')
  .map((ip) => ip.trim())
  .filter(Boolean);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes with IP allowlist
  if (pathname.startsWith('/admin') && ADMIN_IP_ALLOWLIST.length > 0) {
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!ADMIN_IP_ALLOWLIST.includes(clientIp)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  const response = NextResponse.next();

  // Additional security headers not covered by next.config.ts
  // (next.config.ts handles the main CSP / HSTS headers)
  response.headers.set('X-Request-ID', crypto.randomUUID());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/).*)',
  ],
};
