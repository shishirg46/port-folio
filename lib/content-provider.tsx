"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type ContentData = Record<string, any>

const ContentContext = createContext<ContentData | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ContentData | null>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  return <ContentContext.Provider value={data}>{children}</ContentContext.Provider>
}

export function useContentData(): ContentData | null {
  return useContext(ContentContext)
}
