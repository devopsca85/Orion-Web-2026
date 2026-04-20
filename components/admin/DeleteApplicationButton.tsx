'use client'

import { useTransition } from 'react'
import { deleteApplication } from '@/lib/admin/application-actions'
import { Trash2 } from 'lucide-react'

interface Props {
  id: string
  iconOnly?: boolean
}

export function DeleteApplicationButton({ id, iconOnly }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this application permanently? This cannot be undone.')) return
    startTransition(() => deleteApplication(id))
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        title="Delete application"
        className="inline-flex items-center text-slate-400 hover:text-red-500 disabled:opacity-40 border border-slate-200 rounded-md px-2 py-1 hover:border-red-200 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <Trash2 size={15} />
      {isPending ? 'Deleting…' : 'Delete Application'}
    </button>
  )
}
