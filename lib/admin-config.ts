import fs from 'fs';
import path from 'path';

export interface AdminConfig {
  adminUser: string;
  adminPasswordHash: string;
  appearance: {
    siteTitle: string;
    logoUrl: string;
    primaryColor: string;
    description: string;
    footerText: string;
  };
  tools: Record<string, boolean>;
  api: {
    rateLimitRequests: number;
    rateLimitWindowMs: number;
  };
}

const DEFAULT_CONFIG: AdminConfig = {
  adminUser: 'admin',
  adminPasswordHash: '',
  appearance: {
    siteTitle: 'HTML to PDF Platform',
    logoUrl: '',
    primaryColor: '#3b82f6',
    description: 'Convert HTML to PDF instantly',
    footerText: '',
  },
  tools: {
    'html-to-pdf': true,
    'merge-pdf': true,
    'split-pdf': true,
    'rotate-pdf': true,
    'extract-pages': true,
    'add-watermark': true,
    'images-to-pdf': true,
    'compress-image': true,
    'resize-image': true,
    'convert-image': true,
    'rotate-image': true,
    'apply-filters': true,
    'zip-files': true,
    'unzip-files': true,
    'password-generator': true,
    'qr-generator': true,
    'base64-encode': true,
  },
  api: {
    rateLimitRequests: 100,
    rateLimitWindowMs: 3600000,
  },
};

function getConfigPath(): string {
  return process.env.ADMIN_CONFIG_PATH || path.join(process.cwd(), 'admin.json');
}

export function readConfig(): AdminConfig {
  const configPath = getConfigPath();
  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      // Deep merge with defaults so new fields always exist
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        appearance: { ...DEFAULT_CONFIG.appearance, ...parsed.appearance },
        tools: { ...DEFAULT_CONFIG.tools, ...parsed.tools },
        api: { ...DEFAULT_CONFIG.api, ...parsed.api },
      };
    }
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULT_CONFIG };
}

export function writeConfig(config: AdminConfig): void {
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export function updateConfig(partial: Partial<AdminConfig>): AdminConfig {
  const current = readConfig();
  const updated: AdminConfig = {
    ...current,
    ...partial,
    appearance: { ...current.appearance, ...(partial.appearance || {}) },
    tools: { ...current.tools, ...(partial.tools || {}) },
    api: { ...current.api, ...(partial.api || {}) },
  };
  writeConfig(updated);
  return updated;
}
