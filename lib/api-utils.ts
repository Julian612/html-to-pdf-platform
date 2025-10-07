import { NextRequest } from 'next/server';

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  const validKey = process.env.API_KEY;

  if (!validKey) {
    console.error('API_KEY not configured in environment variables');
    return false;
  }

  return apiKey === validKey;
}

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB limit

export function validateFileSize(size: number): boolean {
  return size <= FILE_SIZE_LIMIT;
}

// Rate limiting configuration
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(apiKey);

  if (!record || now > record.resetTime) {
    // First request or window expired
    requestCounts.set(apiKey, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}