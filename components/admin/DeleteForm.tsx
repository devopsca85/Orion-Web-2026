'use client'

import { useTransition, useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DeleteFormProps {
  action: (formData: FormData) => Promise<void>
  label?: string
}

export function DeleteForm({ action, label = 'Delete' }: DeleteFormProps) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-600">Sure?</span>
        <form action={action}>
          <button
            type="submit"
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-medium disabled:opacity-60"
          >
            {isPending ? 'Deleting…' : 'Yes, delete'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded text-xs font-medium"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
    >
      <Trash2 size={13} />
      {label}
    </button>
  )
}
