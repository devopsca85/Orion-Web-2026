'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HorizontalCarouselProps {
  children: React.ReactNode[]
  autoPlayMs?: number      // 0 = no auto-play
  className?: string
}

export function HorizontalCarousel({ children, autoPlayMs = 5000, className }: HorizontalCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [perView, setPerView] = useState(3)
  const [paused, setPaused]   = useState(false)
  const trackRef  = useRef<HTMLDivElement>(null)
  const total     = children.length
  const maxIndex  = Math.max(0, total - perView)

  /* responsive perView */
  useEffect(() => {
    function update() {
      setPerView(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  /* clamp current when perView changes */
  useEffect(() => {
    setCurrent(c => Math.min(c, Math.max(0, total - perView)))
  }, [perView, total])

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent(c => (c >= maxIndex ? 0 : c + 1)), [maxIndex])

  /* auto-play */
  useEffect(() => {
    if (!autoPlayMs || paused) return
    const id = setInterval(next, autoPlayMs)
    return () => clearInterval(id)
  }, [autoPlayMs, paused, next])

  /* slide track */
  useEffect(() => {
    if (!trackRef.current) return
    const card = trackRef.current.children[0] as HTMLElement | undefined
    if (!card) return
    const gap = 24
    const offset = current * (card.offsetWidth + gap)
    trackRef.current.style.transform = `translateX(-${offset}px)`
  }, [current, perView])

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* track viewport */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 transition-transform duration-500 ease-in-out"
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* black circle nav buttons */}
      <button
        onClick={prev}
        disabled={current === 0}
        aria-label="Previous"
        className="absolute -left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-gray-800 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        disabled={maxIndex === 0}
        aria-label="Next"
        className="absolute -right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-gray-800 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ArrowRight className="h-5 w-5" />
      </button>

      {/* dots */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current ? 'w-6 h-2.5 bg-black' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-500',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
