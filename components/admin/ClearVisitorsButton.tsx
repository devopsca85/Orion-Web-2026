'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { clearRecentVisitors } from '@/lib/admin/analytics-actions'

export function ClearVisitorsButton() {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!confirming) { setConfirming(true); return }
    startTransition(async () => {
      await clearRecentVisitors()
      setConfirming(false)
    })
  }

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      disabled={pending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
        confirming
          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
          : 'bg-white text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
      } disabled:opacity-50`}
    >
      <Trash2 size={13} />
      {pending ? 'Clearing…' : confirming ? 'Confirm clear?' : 'Clear past visitors'}
    </button>
  )
}
