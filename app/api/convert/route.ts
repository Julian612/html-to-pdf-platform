import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { validateApiKey, validateFileSize, checkRateLimit } from '@/lib/api-utils';

const isSelfHosted = process.env.DEPLOYMENT_MODE === 'selfhosted';

async function getBrowserConfig() {
  if (isSelfHosted) {
    // Self-hosted mode: use system-installed Chromium (Proxmox LXC, Docker, bare metal)
    const executablePath = process.env.CHROME_PATH || '/usr/bin/chromium';
    return {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
      ],
      executablePath,
    };
  } else {
    // Vercel / serverless mode: use @sparticuz/chromium
    const chromium = (await import('@sparticuz/chromium')).default;
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
    };
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing API key. Include X-API-Key header with your API key.' },
      { status: 401 }
    );
  }

  let browser;

  try {
    const body = await request.json();
    const {
      html,
      url,
      format = 'A4',
      landscape = false,
      margin = { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      printBackground = true,
      scale = 1,
      displayHeaderFooter = false,
      headerTemplate = '',
      footerTemplate = '',
      preferCSSPageSize = false
    } = body;

    if (!html && !url) {
      return NextResponse.json(
        { error: 'Either "html" or "url" parameter is required' },
        { status: 400 }
      );
    }

    const browserConfig = await getBrowserConfig();

    browser = await puppeteer.launch({
      args: browserConfig.args,
      defaultViewport: {
        width: 1280,
        height: 720
      },
      executablePath: browserConfig.executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    if (url) {
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    } else {
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    }

    const pdfBuffer = await page.pdf({
      format: format as any,
      landscape,
      margin,
      printBackground,
      scale,
      displayHeaderFooter,
      headerTemplate,
      footerTemplate,
      preferCSSPageSize
    });

    await browser.close();

    // Convert the PDF buffer to a Blob for proper streaming
    const blob = new Blob([pdfBuffer.buffer], { type: 'application/pdf' });
    const response = new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted.pdf"',
      },
    });
    
    return response;

  } catch (error: any) {
    if (browser) {
      await browser.close();
    }

    console.error('PDF conversion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to convert HTML to PDF',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'HTML to PDF Conversion API',
    version: '1.0.0',
    method: 'POST',
    endpoint: '/api/convert',
    documentation: '/api-docs',
    parameters: {
      required: 'Either "html" (HTML string) or "url" (webpage URL)',
      optional: {
        format: 'Page format (A4, Letter, Legal, etc.) - default: A4',
        landscape: 'Boolean for landscape orientation - default: false',
        margin: 'Object with top, right, bottom, left margins - default: 1cm each',
        printBackground: 'Boolean to print background graphics - default: true',
        scale: 'Scale of webpage rendering (0.1 to 2) - default: 1',
        displayHeaderFooter: 'Boolean to display header/footer - default: false',
        headerTemplate: 'HTML template for header',
        footerTemplate: 'HTML template for footer',
        preferCSSPageSize: 'Boolean to prefer CSS page size - default: false'
      }
    },
    authentication: 'Include X-API-Key header with your API key'
  });
}
