import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  getAdminSession,
} from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const DUMMY_HASH = bcrypt.hashSync('invalid-credential-placeholder', 12)

const LOGIN_LIMIT = { name: 'login', limit: 10, windowMs: 10 * 60 * 1000 }

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  const rate = rateLimit(req, LOGIN_LIMIT)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSeconds) },
      },
    )
  }

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