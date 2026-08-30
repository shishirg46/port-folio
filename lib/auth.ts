import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'admin_session'
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

const SECRET = process.env.SESSION_SECRET

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

function sign(payload: string): string {
  return createHmac('sha256', SECRET ?? '').update(payload).digest('base64url')
}

export function createSessionToken(expiresAt: number = Date.now() + SESSION_TTL_MS): string {
  const nonce = randomBytes(16).toString('base64url')
  const payload = `${nonce}.${expiresAt}`
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string): boolean {
  if (!SECRET) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const payload = `${parts[0]}.${parts[1]}`
  const expected = Buffer.from(sign(payload))
  const provided = Buffer.from(parts[2])
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false
  const expiresAt = Number(parts[1])
  return Number.isFinite(expiresAt) && expiresAt > Date.now()
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: Math.floor(SESSION_TTL_MS / 1000),
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return false
  return verifySessionToken(token)
}

export async function requireAdmin(): Promise<void> {
  if (!(await getAdminSession())) throw new UnauthorizedError()
}