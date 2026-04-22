'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Stat { label: string; value: string }

function parseValue(raw: string): { num: number; prefix: string; suffix: string } {
  const m = raw.match(/^([^0-9]*)([0-9,.]+)([^0-9]*)$/)
  if (!m) return { num: 0, prefix: '', suffix: raw }
  const num = parseFloat(m[2].replace(/,/g, ''))
  return { num: isNaN(num) ? 0 : num, prefix: m[1], suffix: m[3] }
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function CountUp({ value, delay, dark }: { value: string; delay: number; dark: boolean }) {
  const { num, prefix, suffix } = parseValue(value)
  const [display, setDisplay] = useState(num === 0 ? value : `${prefix}0${suffix}`)
  const rafRef = useRef<number | null>(null)
  const DURATION = 1800

  useEffect(() => {
    if (num === 0) { setDisplay(value); return }
    const timer = setTimeout(() => {
      const startTime = performance.now()
      function tick() {
        const t = Math.min((performance.now() - startTime) / DURATION, 1)
        const current = Math.round(easeOutExpo(t) * num)
        setDisplay(`${prefix}${num >= 1000 ? current.toLocaleString() : current}${suffix}`)
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
        else setDisplay(value)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={cn(
      'block text-4xl font-extrabold tabular-nums tracking-tight md:text-5xl',
      dark ? 'text-white' : 'text-indigo-600',
    )}>
      {display}
    </span>
  )
}

export function StatsDisplay({ items, dark }: { items: Stat[]; dark: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn(
      'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      dark ? 'divide-white/10' : 'divide-indigo-100',
      'divide-x-0 md:divide-x',
    )}>
      {items.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-col items-center justify-center px-6 py-10 text-center',
            'transition-all duration-700 ease-out',
            dark ? 'border-b border-white/10 lg:border-b-0' : 'border-b border-indigo-100 lg:border-b-0',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          {/* Animated top accent bar */}
          <span
            className={cn(
              'mb-5 block h-0.5 rounded-full transition-all duration-700 ease-out',
              dark ? 'bg-indigo-300' : 'bg-indigo-500',
              visible ? 'w-8 opacity-100' : 'w-0 opacity-0',
            )}
            style={{ transitionDelay: `${i * 100 + 250}ms` }}
          />

          {visible
            ? <CountUp value={stat.value} delay={i * 100} dark={dark} />
            : <span className="block text-4xl font-extrabold md:text-5xl opacity-0">{stat.value}</span>
          }

          <p className={cn(
            'mt-2 text-[11px] font-semibold uppercase tracking-widest',
            dark ? 'text-indigo-200' : 'text-slate-500',
          )}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
