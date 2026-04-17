'use server'

import { signIn, signOut } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function signInAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    })
    return null
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Invalid email or password. Please try again.'
    }
    throw error
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/admin/login' })
}
