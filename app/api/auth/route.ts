import { NextResponse } from 'next/server'
import { createToken, verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!auth || !verifyToken(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  const { password } = await req.json()
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  return NextResponse.json({ token: createToken() })
}
