'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

interface AdminTopBarProps {
  title: string
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

const roleBadgeColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  EDITOR: 'bg-blue-100 text-blue-700',
  AUTHOR: 'bg-green-100 text-green-700',
}

export function AdminTopBar({ title, user }: AdminTopBarProps) {
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A'

  const roleLabel = user.role?.replace('_', ' ') ?? 'User'
  const badgeClass = roleBadgeColors[user.role ?? ''] ?? 'bg-slate-100 text-slate-600'

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
          {roleLabel}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
