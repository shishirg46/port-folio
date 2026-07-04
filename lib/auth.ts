const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

export function createToken(): string {
  return Buffer.from(ADMIN_PASSWORD).toString('base64')
}

export function verifyToken(token: string): boolean {
  const expected = createToken()
  return token === expected
}
