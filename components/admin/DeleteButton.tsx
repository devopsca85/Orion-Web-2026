'use client'

import { Trash2 } from 'lucide-react'

interface Props {
  action: () => Promise<void>
  label?: string
}

export function DeleteButton({ action, label = 'Delete' }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) {
            e.preventDefault()
          }
        }}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
      >
        <Trash2 size={11} /> {label}
      </button>
    </form>
  )
}
