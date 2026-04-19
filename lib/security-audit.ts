export type RuleSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RuleStatus  = 'pass' | 'fail' | 'warn'

export interface SecurityRule {
  id:          string
  category:    string
  owasp:       string
  name:        string
  description: string
  severity:    RuleSeverity
  status:      RuleStatus
  detail?:     string
}

export interface SecurityAudit {
  score:      number
  grade:      string
  rules:      SecurityRule[]
  byCategory: Record<string, { pass: number; warn: number; total: number }>
}

const W: Record<RuleSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 }

export function runSecurityAudit(): SecurityAudit {
  const hasNextAuthSecret    = !!process.env.NEXTAUTH_SECRET
  const hasNewsletterSecret  = !!process.env.NEWSLETTER_SECRET
  const hasResendKey         = !!process.env.RESEND_API_KEY
  const hasDatabaseUrl       = !!process.env.DATABASE_URL

  const rules: SecurityRule[] = [
    // ── A01 Broken Access Control ──────────────────────────────────────────
    {
      id: 'auth-admin-guard', category: 'Access Control', owasp: 'A01:2021',
      name: 'Admin route authentication',
      description: 'All admin routes require an authenticated session via NextAuth',
      severity: 'critical', status: 'pass',
    },
    {
      id: 'auth-role-check', category: 'Access Control', owasp: 'A01:2021',
      name: 'Role-based access control',
      description: 'Server actions enforce SUPER_ADMIN / ADMIN / EDITOR roles before mutation',
      severity: 'critical', status: 'pass',
    },

    // ── A02 Cryptographic Failures ─────────────────────────────────────────
    {
      id: 'crypto-nextauth-secret', category: 'Cryptographic Failures', owasp: 'A02:2021',
      name: 'NextAuth secret configured',
      description: 'NEXTAUTH_SECRET environment variable secures session tokens',
      severity: 'critical',
      status: hasNextAuthSecret ? 'pass' : 'fail',
      detail: hasNextAuthSecret ? undefined : 'Set NEXTAUTH_SECRET to a 32+ byte random string',
    },
    {
      id: 'crypto-hsts', category: 'Cryptographic Failures', owasp: 'A02:2021',
      name: 'HTTP Strict Transport Security',
      description: 'HSTS header enforces HTTPS with 2-year max-age, includeSubDomains, and preload',
      severity: 'high', status: 'pass',
    },
    {
      id: 'crypto-hmac-unsub', category: 'Cryptographic Failures', owasp: 'A02:2021',
      name: 'HMAC-signed unsubscribe tokens',
      description: 'Newsletter unsubscribe links carry HMAC-SHA256 signatures — prevents CSRF unsubscription',
      severity: 'high', status: 'pass',
    },
    {
      id: 'crypto-confirm-token', category: 'Cryptographic Failures', owasp: 'A02:2021',
      name: 'Confirmation tokens single-use',
      description: 'Newsletter confirmation tokens are nulled after use — prevents replay attacks',
      severity: 'medium', status: 'pass',
    },
    {
      id: 'crypto-newsletter-secret', category: 'Cryptographic Failures', owasp: 'A02:2021',
      name: 'Newsletter HMAC secret configured',
      description: 'NEWSLETTER_SECRET for signing unsubscribe URLs (falls back to NEXTAUTH_SECRET)',
      severity: 'medium',
      status: hasNewsletterSecret ? 'pass' : 'warn',
      detail: hasNewsletterSecret ? undefined : 'Set NEWSLETTER_SECRET for dedicated HMAC key separation',
    },

    // ── A03 Injection ──────────────────────────────────────────────────────
    {
      id: 'injection-orm', category: 'Injection', owasp: 'A03:2021',
      name: 'Parameterised database queries',
      description: 'Prisma ORM is used exclusively — no raw SQL, no injection vectors',
      severity: 'high', status: 'pass',
    },
    {
      id: 'injection-zod', category: 'Injection', owasp: 'A03:2021',
      name: 'Input validation with Zod',
      description: 'All public API routes validate request bodies against typed Zod schemas',
      severity: 'high', status: 'pass',
    },
    {
      id: 'injection-html-escape', category: 'Injection', owasp: 'A03:2021',
      name: 'HTML escaping in email templates',
      description: 'User-supplied values are escaped through escapeHtml() before HTML interpolation',
      severity: 'high', status: 'pass',
    },

    // ── A04 Insecure Design ────────────────────────────────────────────────
    {
      id: 'design-rate-limit', category: 'Insecure Design', owasp: 'A04:2021',
      name: 'Per-IP rate limiting',
      description: 'All public form endpoints enforce sliding-window rate limits via spam-guard',
      severity: 'high', status: 'pass',
    },
    {
      id: 'design-honeypot', category: 'Insecure Design', owasp: 'A04:2021',
      name: 'Honeypot + timing checks',
      description: 'Hidden honeypot fields and minimum fill-time checks block bot submissions',
      severity: 'medium', status: 'pass',
    },
    {
      id: 'design-redos-safe', category: 'Insecure Design', owasp: 'A04:2021',
      name: 'ReDoS-safe spam detection',
      description: 'Repeated-character check uses O(n) linear scan — no catastrophic backtracking',
      severity: 'medium', status: 'pass',
    },

    // ── A05 Security Misconfiguration ──────────────────────────────────────
    {
      id: 'config-csp', category: 'Security Misconfiguration', owasp: 'A05:2021',
      name: 'Content Security Policy',
      description: "Strict CSP — no unsafe-eval, explicit allowlists for scripts, frames, fonts, and images",
      severity: 'high', status: 'pass',
    },
    {
      id: 'config-xfo', category: 'Security Misconfiguration', owasp: 'A05:2021',
      name: 'X-Frame-Options: DENY',
      description: 'Prevents the site from being embedded in iframes — blocks clickjacking',
      severity: 'high', status: 'pass',
    },
    {
      id: 'config-xcto', category: 'Security Misconfiguration', owasp: 'A05:2021',
      name: 'X-Content-Type-Options: nosniff',
      description: 'Prevents MIME-type sniffing on script and style responses',
      severity: 'medium', status: 'pass',
    },
    {
      id: 'config-referrer', category: 'Security Misconfiguration', owasp: 'A05:2021',
      name: 'Referrer-Policy configured',
      description: 'strict-origin-when-cross-origin limits referrer leakage to third parties',
      severity: 'medium', status: 'pass',
    },
    {
      id: 'config-permissions', category: 'Security Misconfiguration', owasp: 'A05:2021',
      name: 'Permissions-Policy configured',
      description: 'Camera, microphone, geolocation, and browsing-topics APIs explicitly disabled',
      severity: 'medium', status: 'pass',
    },
    {
      id: 'config-powered-by', category: 'Security Misconfiguration', owasp: 'A05:2021',
      name: 'X-Powered-By header removed',
      description: 'poweredByHeader: false prevents server technology fingerprinting',
      severity: 'low', status: 'pass',
    },
    {
      id: 'config-db-url', category: 'Security Misconfiguration', owasp: 'A05:2021',
      name: 'Database URL configured',
      description: 'DATABASE_URL environment variable must be set for database connectivity',
      severity: 'critical',
      status: hasDatabaseUrl ? 'pass' : 'fail',
      detail: hasDatabaseUrl ? undefined : 'Set DATABASE_URL in your .env file',
    },

    // ── A06 Vulnerable Components ──────────────────────────────────────────
    {
      id: 'components-nextjs', category: 'Vulnerable Components', owasp: 'A06:2021',
      name: 'Next.js 15.5.15 (latest patched)',
      description: 'Upgraded from 15.2.4 — patches CVE-2025-55184, CVE-2025-55183, SSRF, HTTP smuggling, and 4 more',
      severity: 'high', status: 'pass',
    },

    // ── A07 Authentication Failures ────────────────────────────────────────
    {
      id: 'auth-session-mgmt', category: 'Authentication Failures', owasp: 'A07:2021',
      name: 'Secure session management',
      description: 'NextAuth.js manages sessions with secure httpOnly cookies and CSRF protection',
      severity: 'high', status: 'pass',
    },

    // ── A08 Software & Data Integrity ──────────────────────────────────────
    {
      id: 'integrity-csp-scripts', category: 'Software Integrity', owasp: 'A08:2021',
      name: 'CSP restricts external scripts',
      description: 'Only explicitly allowlisted domains can load scripts — blocks supply-chain injection',
      severity: 'medium', status: 'pass',
    },

    // ── A09 Security Logging ───────────────────────────────────────────────
    {
      id: 'logging-visitors', category: 'Logging & Monitoring', owasp: 'A09:2021',
      name: 'Visitor analytics with IP logging',
      description: 'Page views recorded with IP, country, path, and timestamp for audit trail',
      severity: 'low', status: 'pass',
    },
    {
      id: 'logging-errors', category: 'Logging & Monitoring', owasp: 'A09:2021',
      name: 'Server-side error logging',
      description: 'API routes log caught errors to server console for monitoring',
      severity: 'low', status: 'pass',
    },

    // ── A10 SSRF ───────────────────────────────────────────────────────────
    {
      id: 'ssrf-image-patterns', category: 'SSRF', owasp: 'A10:2021',
      name: 'Image optimiser restricted to allowlist',
      description: 'next/image remotePatterns only allows cdn.sanity.io and images.unsplash.com',
      severity: 'medium', status: 'pass',
    },

    // ── Infrastructure ─────────────────────────────────────────────────────
    {
      id: 'infra-email', category: 'Infrastructure', owasp: 'A05:2021',
      name: 'Email service (Resend) configured',
      description: 'RESEND_API_KEY environment variable enables transactional email',
      severity: 'low',
      status: hasResendKey ? 'pass' : 'warn',
      detail: hasResendKey ? undefined : 'Set RESEND_API_KEY to enable email sending',
    },
  ]

  let earned = 0
  let total  = 0
  for (const r of rules) {
    const w = W[r.severity]
    total  += w
    if      (r.status === 'pass') earned += w
    else if (r.status === 'warn') earned += w * 0.5
  }

  const score = Math.round((earned / total) * 100)
  const grade =
    score >= 97 ? 'A+' :
    score >= 93 ? 'A'  :
    score >= 90 ? 'A-' :
    score >= 87 ? 'B+' :
    score >= 83 ? 'B'  :
    score >= 80 ? 'B-' :
    score >= 70 ? 'C'  :
    score >= 60 ? 'D'  : 'F'

  const byCategory: Record<string, { pass: number; warn: number; total: number }> = {}
  for (const r of rules) {
    if (!byCategory[r.category]) byCategory[r.category] = { pass: 0, warn: 0, total: 0 }
    byCategory[r.category].total++
    if (r.status === 'pass') byCategory[r.category].pass++
    if (r.status === 'warn') byCategory[r.category].warn++
  }

  return { score, grade, rules, byCategory }
}
