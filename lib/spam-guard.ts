// Centralised spam-protection utilities
// Applied to every public form API route

// ── In-memory rate limiter (per namespace × IP) ───────────────────────────────

interface RateEntry { count: number; resetAt: number }
const stores = new Map<string, Map<string, RateEntry>>()

export function checkRateLimit(
  namespace: string,
  ip: string,
  { max = 5, windowMs = 60_000 }: { max?: number; windowMs?: number } = {}
): boolean {
  if (!stores.has(namespace)) stores.set(namespace, new Map())
  const store = stores.get(namespace)!
  const now   = Date.now()
  const rec   = store.get(ip)
  if (!rec || now > rec.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (rec.count >= max) return false
  rec.count++
  return true
}

// Prune stale entries every 30 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const store of stores.values()) {
      for (const [k, rec] of store.entries()) {
        if (now > rec.resetAt) store.delete(k)
      }
    }
  }, 30 * 60_000)
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getIp(req: Request): string {
  // Check headers in priority order — covers Cloudflare, Nginx, and generic proxies
  const raw =
    req.headers.get('cf-connecting-ip') ||                              // Cloudflare
    req.headers.get('true-client-ip') ||                                // Cloudflare Enterprise
    req.headers.get('x-client-ip') ||
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||  // Standard proxy
    req.headers.get('x-real-ip') ||                                     // Nginx proxy_pass
    req.headers.get('x-forwarded') ||
    'unknown'

  // Unwrap IPv4-mapped IPv6 (::ffff:1.2.3.4 → 1.2.3.4) and strip IPv6 localhost
  const ip = raw.trim().replace(/^::ffff:/i, '')
  return ip === '::1' ? '127.0.0.1' : ip
}

// ── IP block list (1-minute in-process cache) ─────────────────────────────────

let _blockedSet: Set<string> = new Set()
let _blockedExpiry = 0
const BLOCKED_CACHE_TTL = 5_000 // 5 seconds — fast enough for newly-blocked IPs

export async function isBlockedIp(ip: string): Promise<boolean> {
  const now = Date.now()
  if (now > _blockedExpiry) {
    try {
      const { prisma } = await import('@/lib/prisma')
      const rows = await prisma.blockedIp.findMany({ select: { ip: true } })
      _blockedSet    = new Set(rows.map((r) => r.ip))
      _blockedExpiry = now + BLOCKED_CACHE_TTL
    } catch (err) {
      console.error('[isBlockedIp] Failed to load blocked IPs from DB:', err)
      // Keep stale set; reset expiry so we retry next request
      _blockedExpiry = 0
    }
  }
  return _blockedSet.has(ip)
}

/** Returns true if the honeypot field was filled (bot behaviour). */
export function isHoneypot(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/** Returns true if the form was submitted unrealistically fast — bots don't wait. */
export function isTooFast(ts: unknown, minMs = 3_000): boolean {
  const n = Number(ts)
  if (isNaN(n) || n <= 0) return false
  return Date.now() - n < minMs
}

const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|poker|lottery|jackpot|click here|buy now|free money|make money fast|work from home|weight loss|diet pills|enlargement|seo service|backlink|adult content)\b/i,
  /https?:\/\/[^\s]+\s+https?:\/\/[^\s]+/i,
]

function hasRepeatedChars(str: string): boolean {
  let count = 1
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) { if (++count >= 10) return true } else { count = 1 }
  }
  return false
}

/** Returns true if any field contains obvious spam patterns. */
export function hasSpamContent(...texts: (string | null | undefined)[]): boolean {
  const combined = texts.filter(Boolean).join(' ').slice(0, 10_000)
  return SPAM_PATTERNS.some((p) => p.test(combined)) || hasRepeatedChars(combined)
}

/** Single-call guard: returns an error response or null if clean. */
export async function spamGuard(
  req: Request,
  namespace: string,
  { _hp, _ts, texts = [], rateLimit }: {
    _hp?: unknown
    _ts?: unknown
    texts?: (string | null | undefined)[]
    rateLimit?: { max: number; windowMs: number }
  }
): Promise<{ blocked: true; status: number; message: string } | null> {
  const ip = getIp(req)

  if (await isBlockedIp(ip)) {
    return { blocked: true, status: 403, message: 'Access denied.' }
  }
  if (!checkRateLimit(namespace, ip, rateLimit ?? { max: 5, windowMs: 60_000 })) {
    return { blocked: true, status: 429, message: 'Too many requests. Please wait a minute and try again.' }
  }
  if (isHoneypot(_hp)) {
    return { blocked: true, status: 400, message: 'Submission rejected.' }
  }
  if (isTooFast(_ts)) {
    return { blocked: true, status: 400, message: 'Submission rejected. Please take a moment to fill out the form.' }
  }
  if (hasSpamContent(...texts)) {
    return { blocked: true, status: 400, message: 'Your message was flagged as spam. Please remove any promotional content and try again.' }
  }
  return null
}
