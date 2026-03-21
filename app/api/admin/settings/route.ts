import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readConfig, updateConfig } from '@/lib/admin-config';
import { getSessionFromRequest, checkCsrf } from '@/lib/admin-auth';

async function requireAuth(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const config = readConfig();
  // Never expose password hash
  const { adminPasswordHash: _, ...safe } = config;
  return NextResponse.json(safe);
}

export async function PATCH(request: NextRequest) {
  if (!checkCsrf(request)) {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 403 });
  }
  const authError = await requireAuth(request);
  if (authError) return authError;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültiger Request-Body' }, { status: 400 });
  }

  const current = readConfig();
  const updates: any = {};

  if (body.appearance) updates.appearance = body.appearance;
  if (body.tools) updates.tools = body.tools;
  if (body.api) updates.api = body.api;

  // Password change
  if (body.newPassword) {
    if (typeof body.newPassword !== 'string' || body.newPassword.length < 8) {
      return NextResponse.json({ error: 'Passwort muss mindestens 8 Zeichen haben' }, { status: 400 });
    }
    updates.adminPasswordHash = await bcrypt.hash(body.newPassword, 12);
  }

  const updated = updateConfig(updates);
  const { adminPasswordHash: _, ...safe } = updated;
  return NextResponse.json(safe);
}
