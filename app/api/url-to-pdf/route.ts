import { NextRequest } from 'next/server';
import { POST as convertPost, GET as convertGet } from '@/app/api/convert/route';

// Alias of /api/convert focused on URL-to-PDF conversions.
// Accepts same parameters but validates that `url` is provided.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (!body.url) {
    const { NextResponse } = await import('next/server');
    return NextResponse.json({ error: '"url" parameter is required for this endpoint' }, { status: 400 });
  }
  // Re-create request with original body so convert handler can re-parse it
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(body),
  });
  return convertPost(newRequest);
}

export async function GET(request: NextRequest) {
  return convertGet();
}
