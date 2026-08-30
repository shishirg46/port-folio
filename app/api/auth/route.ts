import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  getAdminSession,
} from '@/lib/auth'

const DUMMY_HASH = bcrypt.hashSync('invalid-credential-placeholder', 12)

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const data = body as { username?: unknown; password?: unknown } | null
  const username = typeof data?.username === 'string' ? data.username.trim() : ''
  const password = typeof data?.password === 'string' ? data.password : ''
  if (!username || !password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const user = await prisma.adminUser.findUnique({ where: { username } })
  const verified = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH)
  if (!user || !verified) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions)
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 })
  return res
}