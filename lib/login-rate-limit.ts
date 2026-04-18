// In-memory brute-force guard for admin login.
// Resets on server restart; sufficient for single-instance deployments.
// For multi-instance setups, swap the Map for a Redis-backed store.

interface Attempt {
  count: number
  windowStart: number
  lockedUntil: number | null
}

const store = new Map<string, Attempt>()

const MAX_ATTEMPTS   = 5          // failures before lockout
const WINDOW_MS      = 5 * 60_000 // 5-minute sliding window
const LOCKOUT_MS     = 30 * 60_000 // 30-minute lockout

function key(email: string, ip: string) {
  return `${email.toLowerCase()}::${ip}`
}

export function checkLoginRateLimit(email: string, ip: string): { allowed: boolean; retryAfterMs?: number } {
  const k   = key(email, ip)
  const now = Date.now()
  const rec = store.get(k)

  if (rec) {
    // Still locked out?
    if (rec.lockedUntil && now < rec.lockedUntil) {
      return { allowed: false, retryAfterMs: rec.lockedUntil - now }
    }
    // Window expired — reset
    if (now - rec.windowStart > WINDOW_MS) {
      store.delete(k)
    }
  }

  return { allowed: true }
}

export function recordFailedLogin(email: string, ip: string): { locked: boolean; attemptsLeft: number } {
  const k   = key(email, ip)
  const now = Date.now()
  const rec = store.get(k)

  if (!rec || now - rec.windowStart > WINDOW_MS) {
    store.set(k, { count: 1, windowStart: now, lockedUntil: null })
    return { locked: false, attemptsLeft: MAX_ATTEMPTS - 1 }
  }

  rec.count++

  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCKOUT_MS
    return { locked: true, attemptsLeft: 0 }
  }

  return { locked: false, attemptsLeft: MAX_ATTEMPTS - rec.count }
}

export function clearLoginAttempts(email: string, ip: string) {
  store.delete(key(email, ip))
}

// Prune stale entries every hour so the Map doesn't grow unbounded
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, rec] of store.entries()) {
      const expired = rec.lockedUntil ? now > rec.lockedUntil + WINDOW_MS : now - rec.windowStart > WINDOW_MS
      if (expired) store.delete(k)
    }
  }, 60 * 60_000)
}
