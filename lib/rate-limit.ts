export interface RateLimitOptions {
  name: string
  limit: number
  windowMs: number
}

interface Bucket {
  count: number
  windowStart: number
  windowMs: number
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 10_000

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart >= bucket.windowMs) {
      buckets.delete(key)
    }
  }
}

export function rateLimit(
  req: Request,
  options: RateLimitOptions,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const key = `${options.name}:${clientIp(req)}`

  if (buckets.size >= MAX_BUCKETS) {
    pruneExpired(now)
  }

  const bucket = buckets.get(key)
  if (!bucket || now - bucket.windowStart >= bucket.windowMs) {
    buckets.set(key, {
      count: 1,
      windowStart: now,
      windowMs: options.windowMs,
    })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (bucket.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.windowStart + bucket.windowMs - now) / 1000))
    return { allowed: false, retryAfterSeconds }
  }

  bucket.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}