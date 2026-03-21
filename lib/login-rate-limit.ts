// Brute-force protection for the admin login endpoint
// Allows 5 failed attempts per IP before locking out for 15 minutes

interface Attempt {
  count: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, Attempt>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: Request): string {
  const forwarded = (request as any).headers?.get?.('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

export function checkLoginRateLimit(request: Request): { allowed: boolean; remainingMs?: number } {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry?.lockedUntil && now < entry.lockedUntil) {
    return { allowed: false, remainingMs: entry.lockedUntil - now };
  }

  // Reset if lockout expired
  if (entry?.lockedUntil && now >= entry.lockedUntil) {
    attempts.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedLogin(request: Request): void {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, lockedUntil: null };

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(ip, entry);
}

export function recordSuccessfulLogin(request: Request): void {
  const ip = getClientIp(request);
  attempts.delete(ip);
}
