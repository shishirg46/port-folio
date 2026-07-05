"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { WifiOff } from 'lucide-react'

type ContentData = Record<string, any>

const ContentContext = createContext<ContentData | null>(null)

export function useContentData(): ContentData | null {
  return useContext(ContentContext)
}

const gridStyle = {
  backgroundImage: [
    'radial-gradient(circle at 50% 40%, hsl(174 77% 24% / 0.13), transparent 30rem)',
    'linear-gradient(90deg, hsl(35 70% 90% / 0.42) 1px, transparent 1px)',
    'linear-gradient(hsl(35 70% 90% / 0.32) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: 'auto, 4rem 4rem, 4rem 4rem',
} as const

const shimmerStyle = {
  backgroundImage: 'linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--primary)), hsl(var(--foreground)))',
  backgroundSize: '200% auto',
} as const

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ContentData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [split, setSplit] = useState(false)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    setOffline(typeof navigator !== 'undefined' && !navigator.onLine)
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    if (offline || loaded) return
    const start = Date.now()
    fetch('/api/content')
      .then(r => r.json())
      .then(d => {
        const elapsed = Date.now() - start
        const delay = Math.max(0, 1500 - elapsed)
        setTimeout(() => {
          setData(d)
          setSplit(true)
          setTimeout(() => setLoaded(true), 800)
        }, delay)
      })
      .catch(() => {})
  }, [offline, loaded])

  return (
    <ContentContext.Provider value={data}>
      {!loaded && (
        <div
          className={`fixed inset-0 z-50 grid place-items-center bg-background transition-opacity duration-700 ${
            split ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={gridStyle}
        >
          {offline ? (
            <div className="flex flex-col items-center text-center gap-4 px-6">
              <div className="rounded-full bg-destructive/10 p-4">
                <WifiOff className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-lg font-semibold text-foreground">No Internet Connection</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Please check your connection and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 lg:flex-row lg:gap-6">
              <span
                className={`text-4xl font-bold tracking-tight lg:text-5xl bg-clip-text text-transparent ${
                  split ? 'split-first' : 'animate-shimmer'
                }`}
                style={shimmerStyle}
              >
                SHISHIR
              </span>
              <span
                className={`text-4xl font-bold tracking-tight lg:text-5xl bg-clip-text text-transparent ${
                  split ? 'split-last' : 'animate-shimmer'
                }`}
                style={shimmerStyle}
              >
                GHIMIRE
              </span>
            </div>
          )}
        </div>
      )}
      {children}
    </ContentContext.Provider>
  )
}
