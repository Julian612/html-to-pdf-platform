import { NextRequest, NextResponse } from 'next/server';

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  const validKey = process.env.API_KEY;

  return apiKey === validKey;
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { html, filename = 'document.pdf' } = body;

    if (!html || typeof html !== 'string') {
      return NextResponse.json(
        { error: 'HTML content is required and must be a string.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'HTML to PDF conversion requires a third-party service. Use the browser-based tool on the website instead.',
        suggestion: 'Visit the HTML to PDF tool on the main page for browser-based conversion.'
      },
      { status: 501 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/generate-pdf',
    method: 'POST',
    description: 'Convert HTML to PDF',
    authentication: 'Required - use X-API-Key header',
    parameters: {
      html: 'string (required) - HTML content to convert',
      filename: 'string (optional) - Output filename (default: document.pdf)',
      format: 'string (optional) - Page format: A4, Letter, Legal (default: A4)',
      orientation: 'string (optional) - portrait or landscape (default: portrait)'
    },
    example: {
      html: '<html><body><h1>Hello World</h1></body></html>',
      filename: 'my-document.pdf',
      format: 'A4',
      orientation: 'portrait'
    }
  });
}
