'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

export async function blockIp(ip: string) {
  await requireAdmin()
  await prisma.blockedIp.upsert({ where: { ip }, create: { ip }, update: {} })
  revalidatePath('/admin/analytics')
}

export async function unblockIp(ip: string) {
  await requireAdmin()
  await prisma.blockedIp.deleteMany({ where: { ip } })
  revalidatePath('/admin/analytics')
}
