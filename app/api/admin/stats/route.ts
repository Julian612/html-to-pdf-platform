import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin-auth';
import { getStats } from '@/lib/stats';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  return NextResponse.json(getStats());
}
