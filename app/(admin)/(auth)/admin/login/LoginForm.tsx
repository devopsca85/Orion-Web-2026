'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signInAction } from '@/lib/admin/auth-actions'
import { Loader2, AlertCircle } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-2.5 rounded-lg font-medium text-sm transition-colors mt-2"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Signing in&hellip;
        </>
      ) : (
        'Sign In'
      )}
    </button>
  )
}

export function LoginForm() {
  const [error, action] = useActionState(signInAction, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-3">
            <span className="text-3xl font-bold text-white">Orion</span>
            <span className="text-3xl font-bold text-indigo-400">.</span>
            <span className="text-3xl font-bold text-white">CMS</span>
          </div>
          <p className="text-slate-400 text-sm">Orion eSolutions Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to continue to the CMS</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@orionesolutions.com"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <SubmitButton />
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Orion eSolutions &copy; {new Date().getFullYear()} &mdash; Internal use only
        </p>
      </div>
    </div>
  )
}
