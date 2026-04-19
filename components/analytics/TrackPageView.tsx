'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function TrackPageView() {
  const pathname = usePathname()

  useEffect(() => {
    const payload = JSON.stringify({ path: pathname, referrer: document.referrer })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/analytics/track', { method: 'POST', body: payload, keepalive: true }).catch(() => null)
    }
  }, [pathname])

  return null
}
