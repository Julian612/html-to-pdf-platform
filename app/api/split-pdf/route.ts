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
    const { pdf, ranges } = body;

    if (!pdf || typeof pdf !== 'string') {
      return NextResponse.json(
        { error: 'PDF file is required as a base64 string.' },
        { status: 400 }
      );
    }

    if (!ranges || !Array.isArray(ranges) || ranges.length === 0) {
      return NextResponse.json(
        { error: 'Ranges array is required. Format: [{ start: 1, end: 3 }, { start: 4, end: 5 }]' },
        { status: 400 }
      );
    }

    let pdfBytes: Uint8Array;
    if (pdf.startsWith('data:application/pdf;base64,')) {
      const base64Data = pdf.split(',')[1];
      pdfBytes = Buffer.from(base64Data, 'base64');
    } else {
      pdfBytes = Buffer.from(pdf, 'base64');
    }

    const sourcePdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const totalPages = sourcePdf.getPageCount();

    const splitPdfs: { filename: string; data: string; pages: number }[] = [];

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];

      if (!range.start || !range.end || range.start < 1 || range.end > totalPages || range.start > range.end) {
        return NextResponse.json(
          { error: `Invalid range at index ${i}. Start and end must be between 1 and ${totalPages}, and start <= end.` },
          { status: 400 }
        );
      }

      const newPdf = await PDFDocument.create();
      const pageIndices = Array.from({ length: range.end - range.start + 1 }, (_, idx) => range.start - 1 + idx);
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const base64Data = Buffer.from(pdfBytes).toString('base64');

      splitPdfs.push({
        filename: range.filename || `split_${i + 1}_pages_${range.start}-${range.end}.pdf`,
        data: base64Data,
        pages: pageIndices.length
      });
    }

    return NextResponse.json({
      success: true,
      totalPages,
      splits: splitPdfs.length,
      files: splitPdfs
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
    endpoint: '/api/split-pdf',
    method: 'POST',
    description: 'Split a PDF file into multiple documents based on page ranges',
    authentication: 'Required - use X-API-Key header',
    parameters: {
      pdf: 'string (required) - PDF file as base64 string',
      ranges: 'array (required) - Array of page ranges: [{ start: 1, end: 3, filename: "optional.pdf" }]'
    },
    example: {
      pdf: 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC...',
      ranges: [
        { start: 1, end: 2, filename: 'part1.pdf' },
        { start: 3, end: 5, filename: 'part2.pdf' }
      ]
    },
    response: {
      success: true,
      totalPages: 5,
      splits: 2,
      files: [
        { filename: 'part1.pdf', data: 'base64...', pages: 2 },
        { filename: 'part2.pdf', data: 'base64...', pages: 3 }
      ]
    },
    notes: 'Page numbers are 1-indexed. Returns all split PDFs as base64 strings.'
  });
}
