#!/usr/bin/env bash

# Copyright (c) 2024 html-to-pdf-platform
# License: MIT
# https://github.com/Julian612/html-to-pdf-platform
#
# HTML-to-PDF Platform - Installation Script
#
# This script installs the HTML-to-PDF Platform inside a Debian/Ubuntu system.
# It can be run:
#   1. Automatically inside a Proxmox LXC (called by ct/html-to-pdf.sh)
#   2. Manually on any Debian/Ubuntu machine:
#      bash -c "$(wget -qLO - https://raw.githubusercontent.com/Julian612/html-to-pdf-platform/main/install/html-to-pdf-install.sh)"

set -euo pipefail

# ──────────────────────────────────────────────
# Colors
# ──────────────────────────────────────────────
GN="\033[1;92m"
YW="\033[33m"
RD="\033[01;31m"
CL="\033[m"

msg_info() { echo -e "  [${YW}...${CL}] $1"; }
msg_ok()   { echo -e "  [${GN} OK${CL}] $1"; }
msg_error(){ echo -e "  [${RD}FAIL${CL}] $1"; }

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────
APP_NAME="html-to-pdf"
APP_DIR="/opt/html-to-pdf"
REPO_URL="https://github.com/Julian612/html-to-pdf-platform.git"
NODE_MAJOR=20
APP_PORT=3000

# ──────────────────────────────────────────────
# Preflight
# ──────────────────────────────────────────────
if [[ "$(id -u)" -ne 0 ]]; then
  msg_error "This script must be run as root."
  exit 1
fi

echo ""
echo -e "${GN}========================================${CL}"
echo -e "${GN}  HTML-to-PDF Platform Installer${CL}"
echo -e "${GN}========================================${CL}"
echo ""

# ──────────────────────────────────────────────
# 1. System Update & Base Packages
# ──────────────────────────────────────────────
msg_info "Updating system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq
msg_ok "System packages updated"

msg_info "Installing base dependencies"
apt-get install -y -qq \
  curl \
  wget \
  git \
  gnupg2 \
  ca-certificates \
  lsb-release \
  apt-transport-https \
  software-properties-common \
  build-essential \
  &>/dev/null
msg_ok "Base dependencies installed"

# ──────────────────────────────────────────────
# 2. Install Node.js 20 LTS
# ──────────────────────────────────────────────
msg_info "Installing Node.js ${NODE_MAJOR}.x LTS"
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt "$NODE_MAJOR" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - &>/dev/null
  apt-get install -y -qq nodejs &>/dev/null
fi
msg_ok "Node.js $(node -v) installed"
msg_ok "npm $(npm -v) installed"

# ──────────────────────────────────────────────
# 3. Install Chromium & Dependencies
# ──────────────────────────────────────────────
msg_info "Installing Chromium and dependencies for PDF rendering"
apt-get install -y -qq \
  chromium \
  chromium-sandbox \
  fonts-liberation \
  fonts-noto-color-emoji \
  fonts-noto-cjk \
  fonts-freefont-ttf \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  2>/dev/null || true
msg_ok "Chromium installed"

# Detect Chromium path
CHROME_PATH=""
for candidate in /usr/bin/chromium /usr/bin/chromium-browser /usr/bin/google-chrome-stable /usr/bin/google-chrome; do
  if [[ -x "$candidate" ]]; then
    CHROME_PATH="$candidate"
    break
  fi
done

if [[ -z "$CHROME_PATH" ]]; then
  msg_error "Could not find Chromium executable. PDF conversion may not work."
  CHROME_PATH="/usr/bin/chromium"
fi
msg_ok "Chromium path: ${CHROME_PATH}"

# ──────────────────────────────────────────────
# 4. Clone Repository
# ──────────────────────────────────────────────
msg_info "Cloning HTML-to-PDF Platform"
if [[ -d "$APP_DIR" ]]; then
  rm -rf "$APP_DIR"
fi
git clone --depth 1 "$REPO_URL" "$APP_DIR" &>/dev/null
msg_ok "Repository cloned to ${APP_DIR}"

# ──────────────────────────────────────────────
# 5. Install npm Dependencies
# ──────────────────────────────────────────────
msg_info "Installing npm dependencies (this may take a few minutes)"
cd "$APP_DIR"
npm install --production=false 2>&1 | tail -1
msg_ok "npm dependencies installed"

# ──────────────────────────────────────────────
# 6. Configure Environment
# ──────────────────────────────────────────────
msg_info "Configuring environment"

# Generate secrets
API_KEY="sk_prod_$(openssl rand -hex 24)"
ADMIN_JWT_SECRET="$(openssl rand -hex 32)"
ADMIN_PASSWORD="$(openssl rand -base64 12 | tr -d '/+=' | head -c 16)"

cat > "${APP_DIR}/.env" <<ENVEOF
# HTML-to-PDF Platform Configuration
# Generated during installation

# API authentication key
API_KEY=${API_KEY}

# Path to system Chromium (for self-hosted / Proxmox deployment)
CHROME_PATH=${CHROME_PATH}

# Set to 'selfhosted' to use system Chromium instead of @sparticuz/chromium
DEPLOYMENT_MODE=selfhosted

# Admin panel configuration
ADMIN_CONFIG_PATH=${APP_DIR}/admin.json
ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}

# Optional: Rate limiting
# RATE_LIMIT_REQUESTS=100
# RATE_LIMIT_WINDOW_MS=3600000

# Optional: Max file size in bytes (default 10MB)
# MAX_FILE_SIZE=10485760

# Server port
PORT=${APP_PORT}
ENVEOF

msg_ok "Environment configured"

# Generate bcrypt hash for admin password using node
msg_info "Setting up admin account"
ADMIN_HASH=$(node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('${ADMIN_PASSWORD}', 12, (err, hash) => {
  if (err) { process.stderr.write(err.message); process.exit(1); }
  process.stdout.write(hash);
});
" 2>/dev/null)

# Write admin.json
node -e "
const fs = require('fs');
const config = {
  adminUser: 'admin',
  adminPasswordHash: '${ADMIN_HASH}',
  appearance: {
    siteTitle: 'HTML to PDF Platform',
    logoUrl: '',
    primaryColor: '#3b82f6',
    description: 'Convert HTML to PDF instantly',
    footerText: ''
  },
  tools: {
    'html-to-pdf': true, 'merge-pdf': true, 'split-pdf': true, 'rotate-pdf': true,
    'extract-pages': true, 'add-watermark': true, 'images-to-pdf': true,
    'compress-image': true, 'resize-image': true, 'convert-image': true,
    'rotate-image': true, 'apply-filters': true, 'zip-files': true,
    'unzip-files': true, 'password-generator': true, 'qr-generator': true,
    'base64-encode': true
  },
  api: { rateLimitRequests: 100, rateLimitWindowMs: 3600000 }
};
fs.writeFileSync('${APP_DIR}/admin.json', JSON.stringify(config, null, 2));
" 2>/dev/null

msg_ok "Admin account created (user: admin)"

# ──────────────────────────────────────────────
# 7. Build Application
# ──────────────────────────────────────────────
msg_info "Building Next.js application (this may take a while)"
cd "$APP_DIR"
npm run build 2>&1 | tail -3
msg_ok "Application built successfully"

# ──────────────────────────────────────────────
# 8. Create Systemd Service
# ──────────────────────────────────────────────
msg_info "Creating systemd service"

cat > /etc/systemd/system/html-to-pdf.service <<SVCEOF
[Unit]
Description=HTML-to-PDF Conversion Platform
Documentation=https://github.com/Julian612/html-to-pdf-platform
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}
ExecStart=${APP_DIR}/node_modules/.bin/next start -p ${APP_PORT}
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=html-to-pdf

# Environment
EnvironmentFile=${APP_DIR}/.env
Environment=NODE_ENV=production
Environment=PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
Environment=PUPPETEER_EXECUTABLE_PATH=${CHROME_PATH}

# Security hardening
NoNewPrivileges=false
ProtectSystem=false
ProtectHome=false

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable html-to-pdf.service &>/dev/null
msg_ok "Systemd service created and enabled"

# ──────────────────────────────────────────────
# 9. Start Service
# ──────────────────────────────────────────────
msg_info "Starting HTML-to-PDF service"
systemctl start html-to-pdf.service
sleep 3

if systemctl is-active --quiet html-to-pdf.service; then
  msg_ok "Service is running"
else
  msg_error "Service failed to start. Check: journalctl -u html-to-pdf -n 50"
fi

# ──────────────────────────────────────────────
# 10. Cleanup
# ──────────────────────────────────────────────
msg_info "Cleaning up"
apt-get autoremove -y -qq &>/dev/null
apt-get clean &>/dev/null
msg_ok "Cleanup complete"

# ──────────────────────────────────────────────
# Done
# ──────────────────────────────────────────────
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
echo ""
echo -e "${GN}========================================${CL}"
echo -e "${GN}  Installation Complete!${CL}"
echo -e "${GN}========================================${CL}"
echo ""
echo -e "  Web Interface:  ${GN}http://${IP}:${APP_PORT}${CL}"
echo -e "  Admin Panel:    ${GN}http://${IP}:${APP_PORT}/admin${CL}"
echo -e "  API Endpoint:   ${GN}http://${IP}:${APP_PORT}/api/convert${CL}"
echo -e "  API Docs:       ${GN}http://${IP}:${APP_PORT}/api-docs${CL}"
echo ""
echo -e "  Admin Login:    ${YW}admin / ${ADMIN_PASSWORD}${CL}"
echo -e "  API Key:        ${YW}${API_KEY}${CL}"
echo -e "  Config File:    ${YW}${APP_DIR}/.env${CL}"
echo ""
echo -e "  ${YW}Service Commands:${CL}"
echo -e "    systemctl status html-to-pdf"
echo -e "    systemctl restart html-to-pdf"
echo -e "    journalctl -u html-to-pdf -f"
echo ""
echo -e "  ${YW}Test the API:${CL}"
echo -e "    curl -X POST http://${IP}:${APP_PORT}/api/convert \\"
echo -e "      -H 'Content-Type: application/json' \\"
echo -e "      -H 'X-API-Key: ${API_KEY}' \\"
echo -e "      -d '{\"html\": \"<h1>Hello World</h1>\"}' \\"
echo -e "      -o test.pdf"
echo ""
