import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '2.0.0',
    engine: 'puppeteer',
    timestamp: new Date().toISOString(),
    deploymentMode: process.env.DEPLOYMENT_MODE || 'serverless',
  });
}
