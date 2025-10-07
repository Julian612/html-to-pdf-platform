import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

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
    const { pdfs, filename = 'merged.pdf' } = body;

    if (!pdfs || !Array.isArray(pdfs) || pdfs.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required. Provide as base64 strings in "pdfs" array.' },
        { status: 400 }
      );
    }

    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < pdfs.length; i++) {
      try {
        let pdfBytes: Uint8Array;

        if (pdfs[i].startsWith('data:application/pdf;base64,')) {
          const base64Data = pdfs[i].split(',')[1];
          pdfBytes = Buffer.from(base64Data, 'base64');
        } else {
          pdfBytes = Buffer.from(pdfs[i], 'base64');
        }

        const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (error) {
        return NextResponse.json(
          { error: `Invalid PDF file at index ${i}. Please ensure all files are valid PDFs.` },
          { status: 400 }
        );
      }
    }

    const mergedPdfBytes = await mergedPdf.save();

    return new NextResponse(Buffer.from(mergedPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/merge-pdf',
    method: 'POST',
    description: 'Merge multiple PDF files into one',
    authentication: 'Required - use X-API-Key header',
    parameters: {
      pdfs: 'array (required) - Array of PDF files as base64 strings',
      filename: 'string (optional) - Output filename (default: merged.pdf)'
    },
    example: {
      pdfs: [
        'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC...',
        'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC...'
      ],
      filename: 'combined.pdf'
    },
    notes: 'Supports both raw base64 and data URIs (data:application/pdf;base64,...)'
  });
}
