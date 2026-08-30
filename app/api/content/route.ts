import { NextResponse } from 'next/server'
import { getAllContent } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET() {
  const content = await getAllContent()
  return NextResponse.json(content)
}