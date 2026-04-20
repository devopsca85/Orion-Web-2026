'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
}

export async function clearAllCache() {
  await requireAdmin()
  revalidateTag('nav')
  revalidateTag('site-settings')
  revalidatePath('/', 'layout')
}
