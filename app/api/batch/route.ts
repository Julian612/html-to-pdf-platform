import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import JSZip from 'jszip';
import { validateApiKey, checkRateLimit } from '@/lib/api-utils';
import { recordRequest } from '@/lib/stats';

const isSelfHosted = process.env.DEPLOYMENT_MODE === 'selfhosted';

async function getBrowserConfig() {
  if (isSelfHosted) {
    return {
      args: [
        '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
        '--disable-gpu', '--no-first-run', '--no-zygote', '--single-process', '--disable-extensions',
      ],
      executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
    };
  }
  const chromium = (await import('@sparticuz/chromium')).default;
  return { args: chromium.args, executablePath: await chromium.executablePath() };
}

interface BatchJob {
  html?: string;
  url?: string;
  filename?: string;
  format?: string;
  landscape?: boolean;
  margin?: { top: string; right: string; bottom: string; left: string };
  printBackground?: boolean;
  mediaType?: string;
  injectCss?: string;
  waitUntil?: string;
  wait?: number;
  timeout?: number;
}

const MAX_JOBS = 10;

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: { jobs?: BatchJob[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { jobs } = body;
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return NextResponse.json({ error: '"jobs" array is required' }, { status: 400 });
  }
  if (jobs.length > MAX_JOBS) {
    return NextResponse.json({ error: `Maximum ${MAX_JOBS} jobs per batch request` }, { status: 400 });
  }

  let browser;
  try {
    const browserConfig = await getBrowserConfig();
    browser = await puppeteer.launch({
      args: browserConfig.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: browserConfig.executablePath,
      headless: true,
    });

    const zip = new JSZip();
    const results: { filename: string; success: boolean; error?: string }[] = [];

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const safeFilename = (job.filename || `document-${i + 1}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');

      try {
        if (!job.html && !job.url) {
          results.push({ filename: safeFilename, success: false, error: 'Either html or url is required' });
          continue;
        }

        const page = await browser.newPage();
        const validMediaType = job.mediaType === 'screen' ? 'screen' : 'print';
        await page.emulateMediaType(validMediaType as any);

        const validWaitUntil = ['networkidle0', 'networkidle2', 'load', 'domcontentloaded']
          .includes(job.waitUntil || '') ? job.waitUntil as any : 'networkidle0';
        const safeTimeout = Math.min(Math.max(Number(job.timeout) || 30000, 5000), 60000);
        const safeWait = Math.min(Math.max(Number(job.wait) || 0, 0), 10000);

        if (job.url) {
          await page.goto(job.url, { waitUntil: validWaitUntil, timeout: safeTimeout });
        } else {
          await page.setContent(job.html!, { waitUntil: validWaitUntil, timeout: safeTimeout });
        }

        if (job.injectCss) await page.addStyleTag({ content: job.injectCss });
        if (safeWait > 0) await new Promise(r => setTimeout(r, safeWait));

        const pdfBuffer = await page.pdf({
          format: (job.format as any) || 'A4',
          landscape: job.landscape || false,
          margin: job.margin || { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
          printBackground: job.printBackground !== false,
        });

        await page.close();
        zip.file(safeFilename, pdfBuffer);
        results.push({ filename: safeFilename, success: true });
      } catch (err: any) {
        results.push({ filename: safeFilename, success: false, error: err.message });
      }
    }

    await browser.close();

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    recordRequest('/api/batch', true);

    const response = new Response(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="batch-pdfs.zip"',
        'X-Batch-Results': JSON.stringify(results),
      },
    });
    return response;

  } catch (error: any) {
    if (browser) await browser.close();
    console.error('Batch conversion error:', error);
    recordRequest('/api/batch', false, error.message);
    return NextResponse.json({ error: 'Batch conversion failed', message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Batch HTML/URL to PDF Conversion',
    version: '1.0.0',
    method: 'POST',
    endpoint: '/api/batch',
    maxJobs: MAX_JOBS,
    description: 'Convert multiple HTML/URL sources to PDFs and receive them as a ZIP archive',
    body: {
      jobs: 'Array of job objects (max 10)',
      'jobs[].html': 'HTML string (or use url)',
      'jobs[].url': 'URL to convert (or use html)',
      'jobs[].filename': 'Output filename in ZIP – default: document-N.pdf',
      'jobs[].format': 'Page format – default: A4',
      'jobs[].landscape': 'Landscape orientation – default: false',
      'jobs[].margin': 'Margins object – default: 1cm each',
      'jobs[].printBackground': 'Print background – default: true',
      'jobs[].mediaType': '"print" or "screen" – default: print',
      'jobs[].injectCss': 'CSS to inject before rendering',
      'jobs[].waitUntil': 'Wait condition – default: networkidle0',
      'jobs[].wait': 'Extra wait in ms (max 10000)',
      'jobs[].timeout': 'Navigation timeout ms (max 60000)',
    },
    response: 'ZIP file (application/zip). Check X-Batch-Results header for per-job status.',
    authentication: 'Include X-API-Key header',
  });
}
