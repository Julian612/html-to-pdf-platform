import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  return clearSessionCookie(response);
}
