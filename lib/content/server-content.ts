import { cache } from 'react'
import { getSectionContent } from './repository'
import type { SectionKey } from './types'

export const getSectionForRender = cache(
  async (section: SectionKey): Promise<Record<string, unknown>> =>
    ((await getSectionContent(section)) ?? {}) as Record<string, unknown>,
)
