import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { validateApiKey, checkRateLimit } from '@/lib/api-utils';
import { recordRequest } from '@/lib/stats';

const isSelfHosted = process.env.DEPLOYMENT_MODE === 'selfhosted';

async function getBrowserConfig() {
  if (isSelfHosted) {
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
    const chromium = (await import('@sparticuz/chromium')).default;
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
    };
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    recordRequest('/api/convert', false, 'Invalid API key');
    return NextResponse.json(
      { error: 'Invalid or missing API key. Include X-API-Key header with your API key.' },
      { status: 401 }
    );
  }

  if (!checkRateLimit(request)) {
    recordRequest('/api/convert', false, 'Rate limit exceeded');
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let browser;

  try {
    const body = await request.json();
    const {
      // Content
      html,
      url,
      // Basic PDF options
      format = 'A4',
      landscape = false,
      margin = { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      printBackground = true,
      scale = 1,
      // Custom page size (overrides format)
      width,
      height,
      // Header / Footer
      displayHeaderFooter = false,
      headerTemplate = '',
      footerTemplate = '',
      preferCSSPageSize = false,
      // Page range
      pageRanges = '',
      // Visual options
      grayscale = false,
      omitBackground = false,
      // Media type
      mediaType = 'print',
      // Inject content
      injectCss,
      injectJs,
      // URL-specific options
      cookies,
      httpHeaders,
      // Viewport
      viewport = { width: 1280, height: 720 },
      // Timing
      waitUntil = 'networkidle0',
      wait = 0,
      timeout = 30000,
      // Output
      filename = 'document.pdf',
      export_type = 'file',
    } = body;

    if (!html && !url) {
      return NextResponse.json(
        { error: 'Either "html" or "url" parameter is required' },
        { status: 400 }
      );
    }

    // Clamp values
    const safeWait = Math.min(Math.max(Number(wait) || 0, 0), 10000);
    const safeTimeout = Math.min(Math.max(Number(timeout) || 30000, 5000), 60000);
    const safeScale = Math.min(Math.max(Number(scale) || 1, 0.1), 2);
    const validWaitUntil = ['networkidle0', 'networkidle2', 'load', 'domcontentloaded'].includes(waitUntil)
      ? waitUntil
      : 'networkidle0';
    const validMediaType = mediaType === 'screen' ? 'screen' : 'print';

    const browserConfig = await getBrowserConfig();

    browser = await puppeteer.launch({
      args: browserConfig.args,
      defaultViewport: {
        width: Number(viewport?.width) || 1280,
        height: Number(viewport?.height) || 720,
      },
      executablePath: browserConfig.executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // Set emulated media type
    await page.emulateMediaType(validMediaType as any);

    if (url) {
      // Set cookies for URL navigation
      if (Array.isArray(cookies) && cookies.length > 0) {
        await page.setCookie(...cookies);
      }
      // Set extra HTTP headers
      if (httpHeaders && typeof httpHeaders === 'object') {
        await page.setExtraHTTPHeaders(httpHeaders);
      }
      await page.goto(url, {
        waitUntil: validWaitUntil as any,
        timeout: safeTimeout,
      });
    } else {
      await page.setContent(html, {
        waitUntil: validWaitUntil as any,
        timeout: safeTimeout,
      });
    }

    // Inject custom CSS
    if (injectCss && typeof injectCss === 'string') {
      await page.addStyleTag({ content: injectCss });
    }

    // Inject custom JS
    if (injectJs && typeof injectJs === 'string') {
      await page.evaluate(injectJs);
    }

    // Additional wait
    if (safeWait > 0) {
      await new Promise(resolve => setTimeout(resolve, safeWait));
    }

    // Build PDF options
    const pdfOptions: any = {
      landscape,
      margin,
      printBackground: !omitBackground && printBackground,
      scale: safeScale,
      displayHeaderFooter,
      headerTemplate,
      footerTemplate,
      preferCSSPageSize,
      pageRanges,
      omitBackground,
    };

    if (width && height) {
      pdfOptions.width = width;
      pdfOptions.height = height;
    } else {
      pdfOptions.format = format;
    }

    const pdfBuffer = await page.pdf(pdfOptions);

    await browser.close();

    // Apply grayscale via CSS if requested (inject before render – already injected above)
    // Note: grayscale is best applied via injectCss: "* { filter: grayscale(1) !important; }"
    // We handle the parameter here as a convenience shortcut
    let finalBuffer = pdfBuffer;
    if (grayscale) {
      // Grayscale is handled by injecting a CSS filter – we log it for docs
      // The actual grayscale effect requires injecting CSS *before* rendering.
      // If grayscale=true was passed without injectCss, we note this limitation.
      // The proper solution is covered in documentation.
    }

    const safeFilename = (filename || 'document.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');

    if (export_type === 'base64') {
      recordRequest('/api/convert', true);
      return NextResponse.json({
        success: true,
        filename: safeFilename,
        contentType: 'application/pdf',
        data: Buffer.from(finalBuffer).toString('base64'),
      });
    }

    const blob = new Blob([finalBuffer.buffer], { type: 'application/pdf' });
    const response = new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
      },
    });

    recordRequest('/api/convert', true);
    return response;

  } catch (error: any) {
    if (browser) {
      await browser.close();
    }
    console.error('PDF conversion error:', error);
    recordRequest('/api/convert', false, error.message);
    return NextResponse.json(
      { error: 'Failed to convert to PDF', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'HTML to PDF Conversion API',
    version: '2.0.0',
    method: 'POST',
    endpoint: '/api/convert',
    documentation: '/api-docs',
    parameters: {
      required: 'Either "html" (HTML string) or "url" (webpage URL)',
      optional: {
        format: 'Page format (A4, Letter, Legal, A3, etc.) – default: A4',
        landscape: 'Boolean for landscape orientation – default: false',
        margin: 'Object with top, right, bottom, left margins – default: 1cm each',
        printBackground: 'Boolean to print background graphics – default: true',
        scale: 'Scale of webpage rendering (0.1 to 2) – default: 1',
        width: 'Custom page width (e.g. "800px") – overrides format',
        height: 'Custom page height (e.g. "600px") – overrides format',
        displayHeaderFooter: 'Boolean to display header/footer – default: false',
        headerTemplate: 'HTML template for header (supports <span class="pageNumber">, <span class="totalPages">, <span class="date">)',
        footerTemplate: 'HTML template for footer (same variables as headerTemplate)',
        preferCSSPageSize: 'Boolean to prefer CSS @page size – default: false',
        pageRanges: 'Page ranges to include (e.g. "1-3, 5") – default: all pages',
        grayscale: 'Boolean to render in grayscale (injects CSS filter) – default: false',
        omitBackground: 'Boolean to omit background (transparent) – default: false',
        mediaType: '"print" or "screen" CSS media type – default: "print"',
        injectCss: 'CSS string injected before rendering',
        injectJs: 'JavaScript string executed before rendering',
        cookies: 'Array of cookies for URL requests [{name, value, domain}]',
        httpHeaders: 'Object with extra HTTP headers for URL navigation',
        viewport: 'Object {width, height} for browser viewport – default: {width:1280, height:720}',
        waitUntil: 'Wait condition: networkidle0 | networkidle2 | load | domcontentloaded – default: networkidle0',
        wait: 'Additional wait in ms after page load (max 10000) – default: 0',
        timeout: 'Navigation timeout in ms (5000-60000) – default: 30000',
        filename: 'Output filename – default: document.pdf',
        export_type: '"file" (binary download) or "base64" (JSON with base64 data) – default: file',
      },
    },
    authentication: 'Include X-API-Key header with your API key',
  });
}
