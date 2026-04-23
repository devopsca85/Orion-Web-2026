'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Metric { value: string; label: string }

export function MetricsEditor({ defaultMetrics = [] }: { defaultMetrics?: Metric[] }) {
  const [metrics, setMetrics] = useState<Metric[]>(
    defaultMetrics.length > 0 ? defaultMetrics : [{ value: '', label: '' }]
  )

  function add() {
    setMetrics(m => [...m, { value: '', label: '' }])
  }

  function remove(i: number) {
    setMetrics(m => m.filter((_, idx) => idx !== i))
  }

  function update(i: number, field: 'value' | 'label', val: string) {
    setMetrics(m => m.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }

  const filled = metrics.filter(m => m.value && m.label)

  return (
    <div className="space-y-2">
      {metrics.map((m, i) => (
        <div key={i} className="flex gap-2 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Value  e.g. 10x faster"
              value={m.value}
              onChange={e => update(i, 'value', e.target.value)}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Label  e.g. Deployment Frequency"
              value={m.label}
              onChange={e => update(i, 'label', e.target.value)}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={metrics.length === 1}
            className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        disabled={metrics.length >= 4}
        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-40 transition-colors"
      >
        <Plus size={13} /> Add metric
      </button>

      {/* hidden JSON field consumed by the server action */}
      <input type="hidden" name="metrics" value={JSON.stringify(filled)} />
    </div>
  )
}
