'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  quote: string
  name: string
  title: string | null
  company: string | null
  rating: number
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('h-4 w-4', i < rating ? 'text-secondary fill-current' : 'text-gray-200 fill-current')}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)
  const [perView, setPerView] = useState(3)
  const trackRef = useRef<HTMLDivElement>(null)
  const total = items.length

  /* responsive perView */
  useEffect(() => {
    function update() {
      setPerView(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, total - perView)

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent(c => (c >= maxIndex ? 0 : c + 1)), [maxIndex])

  /* auto-play */
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next])

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
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* viewport — clips the track */}
      <div className="overflow-hidden">
        {/* sliding track */}
        <div
          ref={trackRef}
          className="flex gap-6 transition-transform duration-500 ease-in-out"
        >
          {items.map((t) => (
            <div
              key={t.id}
              className="flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
            >
              <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-7">
                <Quote className="mb-4 h-8 w-8 text-secondary/25" />
                <Stars rating={t.rating} />
                <blockquote className="flex-1 mt-4 text-sm leading-relaxed text-gray-700 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                  {/* avatar initial */}
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">
                      {[t.title, t.company].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* prev / next */}
      <button
        onClick={prev}
        disabled={current === 0}
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        disabled={current === maxIndex && maxIndex !== 0}
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* dots */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current
                  ? 'w-6 h-2.5 bg-secondary'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
