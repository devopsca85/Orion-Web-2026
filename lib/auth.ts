import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { checkLoginRateLimit, recordFailedLogin, clearLoginAttempts } from '@/lib/login-rate-limit'
import { headers } from 'next/headers'

async function getClientIp(): Promise<string> {
  try {
    const h = await headers()
    return (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? '').split(',')[0].trim() || 'unknown'
  } catch {
    return 'unknown'
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const ip    = await getClientIp()

        // Rate-limit check before hitting DB
        const { allowed, retryAfterMs } = checkLoginRateLimit(email, ip)
        if (!allowed) {
          const minutes = Math.ceil((retryAfterMs ?? 0) / 60_000)
          throw new Error(`Too many failed attempts. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`)
        }

        const user = await prisma.user.findUnique({
          where: { email, active: true },
        })

        if (!user) {
          recordFailedLogin(email, ip)
          return null
        }

        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) {
          const { locked, attemptsLeft } = recordFailedLogin(email, ip)
          if (locked) {
            throw new Error('Account temporarily locked due to too many failed attempts. Try again in 30 minutes.')
          }
          if (attemptsLeft <= 2) {
            throw new Error(`Incorrect password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining before lockout.`)
          }
          return null
        }

        // Success — clear any recorded failures
        clearLoginAttempts(email, ip)
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        return { id: user.id, name: user.name, email: user.email, role: user.role as string }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id as string
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: { signIn: '/admin/login' },
})
