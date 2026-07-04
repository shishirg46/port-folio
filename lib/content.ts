"use client"

import { useState, useEffect } from 'react'
import { useContentData } from './content-provider'

export function useContent<T>(section: string, defaultData: T): { data: T; loading: boolean } {
  const allContent = useContentData()
  const [data, setData] = useState<T>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (allContent && allContent[section] && Object.keys(allContent[section]).length > 0) {
      setData(allContent[section] as T)
      setLoading(false)
      return
    }
    fetch(`/api/content/${section}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && Object.keys(json).length > 0) setData(json as T)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [section, allContent])

  return { data, loading }
}
