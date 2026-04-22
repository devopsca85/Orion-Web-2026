import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export const metadata = {
  title: 'Sign In — Orion eSolutions CMS',
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
