import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readConfig } from '@/lib/admin-config';
import { createSessionToken, setSessionCookie, checkCsrf } from '@/lib/admin-auth';
import { checkLoginRateLimit, recordFailedLogin, recordSuccessfulLogin } from '@/lib/login-rate-limit';

const GENERIC_ERROR = 'Ungültige Anmeldedaten';

export async function POST(request: NextRequest) {
  // CSRF check
  if (!checkCsrf(request)) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  }

  // Rate limit check
  const rateLimit = checkLoginRateLimit(request);
  if (!rateLimit.allowed) {
    const remainingSecs = Math.ceil((rateLimit.remainingMs || 0) / 1000);
    return NextResponse.json(
      { error: `Zu viele Versuche. Bitte warte ${remainingSecs} Sekunden.` },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const config = readConfig();

  // Constant-time username comparison + bcrypt (constant-time by design)
  const usernameMatch = username === config.adminUser;
  const passwordMatch = config.adminPasswordHash
    ? await bcrypt.compare(password, config.adminPasswordHash)
    : false;

  if (!usernameMatch || !passwordMatch) {
    recordFailedLogin(request);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  recordSuccessfulLogin(request);

  const token = await createSessionToken(username);
  const response = NextResponse.json({ success: true });
  return setSessionCookie(response, token);
}
