// config.ts
interface Config {
  apiKey: string;
  maxFileSize: number;
  rateLimit: {
    requestsPerHour: number;
    windowMs: number;
  };
}

export const config: Config = {
  apiKey: process.env.API_KEY || '',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  rateLimit: {
    requestsPerHour: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

// Validation function to ensure required environment variables are set
export function validateConfig() {
  const missingVars = [];
  
  if (!process.env.API_KEY) {
    missingVars.push('API_KEY');
  }

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('The application will still work, but API endpoints will be inaccessible without an API key.');
  }
}