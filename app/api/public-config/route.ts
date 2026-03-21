import { NextResponse } from 'next/server';
import { readConfig } from '@/lib/admin-config';

// Public endpoint – returns only non-sensitive config (appearance + tools)
export async function GET() {
  const config = readConfig();
  return NextResponse.json({
    appearance: config.appearance,
    tools: config.tools,
  });
}
