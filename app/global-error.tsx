'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', background: '#fef2f2' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #fca5a5' }}>
          <h2 style={{ color: '#dc2626', marginTop: 0 }}>Something went wrong</h2>
          <p style={{ color: '#374151' }}>{error?.message || 'An unexpected error occurred'}</p>
          {error?.digest && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Digest: {error.digest}</p>
          )}
          <pre style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontSize: '0.75rem', overflow: 'auto', color: '#374151' }}>
            {error?.stack}
          </pre>
          <button
            onClick={reset}
            style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
