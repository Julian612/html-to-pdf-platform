#!/usr/bin/env bash

# Copyright (c) 2024 html-to-pdf-platform
# License: MIT
# https://github.com/Julian612/html-to-pdf-platform

################################################################################
# HTML-to-PDF Platform - Proxmox LXC Helper Script
#
# Usage:
#   bash -c "$(wget -qLO - https://raw.githubusercontent.com/Julian612/html-to-pdf-platform/main/ct/html-to-pdf.sh)"
#
# This script creates a Debian 12 LXC container on Proxmox VE and installs
# the HTML-to-PDF Platform with all dependencies (Node.js, Chromium, etc.)
################################################################################

set -euo pipefail

# ──────────────────────────────────────────────
# Colors & Formatting
# ──────────────────────────────────────────────
RD="\033[01;31m"
GN="\033[1;92m"
YW="\033[33m"
BL="\033[36m"
CL="\033[m"
BFR="\\r\\033[K"
HOLD=" "
CM="${GN}\xE2\x9C\x93${CL}"
CROSS="${RD}\xE2\x9C\x97${CL}"

# ──────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────
msg_info() { echo -ne " ${HOLD} ${YW}$1...${CL}"; }
msg_ok()   { echo -e "${BFR} ${CM} ${GN}$1${CL}"; }
msg_error(){ echo -e "${BFR} ${CROSS} ${RD}$1${CL}"; }

header_info() {
  clear
  cat <<"EOF"

    __  ______  _____    __              ____  ____  ______
   / / / /_  / /  _/ /  / /_____        / __ \/ __ \/ ____/
  / /_/ / / /  / / / /  / __/ __ \     / /_/ / / / / /_
 / __  / / /__/ / / /  / /_/ /_/ /    / ____/ /_/ / __/
/_/ /_/ /___/___//_/   \__/\____/    /_/   /_____/_/

       HTML-to-PDF Conversion Platform for Proxmox

EOF
}

# ──────────────────────────────────────────────
# Preflight Checks
# ──────────────────────────────────────────────
check_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    msg_error "This script must be run as root (on the Proxmox host)."
    echo -e "Run: ${GN}sudo bash ${0}${CL}"
    exit 1
  fi
}

check_proxmox() {
  if ! command -v pct &>/dev/null; then
    msg_error "This script must be run on a Proxmox VE host."
    echo -e "  'pct' command not found. Are you on the Proxmox host?"
    exit 1
  fi
  if ! command -v pvesh &>/dev/null; then
    msg_error "Proxmox VE tools not found."
    exit 1
  fi
}

# ──────────────────────────────────────────────
# Get Next Available CT ID
# ──────────────────────────────────────────────
next_id() {
  pvesh get /cluster/nextid 2>/dev/null || echo "100"
}

# ──────────────────────────────────────────────
# Settings
# ──────────────────────────────────────────────
APP="HTML-to-PDF"
REPO_URL="https://github.com/Julian612/html-to-pdf-platform.git"

# Defaults
DEFAULT_CT_ID=$(next_id)
DEFAULT_HN="html-to-pdf"
DEFAULT_DISK_SIZE="6"
DEFAULT_CORE_COUNT="2"
DEFAULT_RAM_SIZE="2048"
DEFAULT_BRG="vmbr0"
DEFAULT_GATE=""
DEFAULT_STORAGE=""

# ──────────────────────────────────────────────
# Detect Storage
# ──────────────────────────────────────────────
detect_storage() {
  local -a storages
  while IFS= read -r line; do
    storages+=("$line")
  done < <(pvesm status -content rootdir 2>/dev/null | awk 'NR>1 {print $1}')

  if [[ ${#storages[@]} -eq 0 ]]; then
    msg_error "No storage found with 'rootdir' content type."
    exit 1
  elif [[ ${#storages[@]} -eq 1 ]]; then
    DEFAULT_STORAGE="${storages[0]}"
  else
    # Prefer 'local-lvm', then 'local'
    for s in "local-lvm" "local"; do
      for avail in "${storages[@]}"; do
        if [[ "$avail" == "$s" ]]; then
          DEFAULT_STORAGE="$s"
          return
        fi
      done
    done
    DEFAULT_STORAGE="${storages[0]}"
  fi
}

# ──────────────────────────────────────────────
# User Settings Prompt
# ──────────────────────────────────────────────
default_settings() {
  echo -e "\n${BL}Using default settings:${CL}\n"
  CT_ID=$DEFAULT_CT_ID
  HN=$DEFAULT_HN
  DISK_SIZE=$DEFAULT_DISK_SIZE
  CORE_COUNT=$DEFAULT_CORE_COUNT
  RAM_SIZE=$DEFAULT_RAM_SIZE
  BRG=$DEFAULT_BRG
  GATE=$DEFAULT_GATE
  STORAGE=$DEFAULT_STORAGE

  echo -e "  ${GN}CT ID:${CL}       ${YW}${CT_ID}${CL}"
  echo -e "  ${GN}Hostname:${CL}    ${YW}${HN}${CL}"
  echo -e "  ${GN}Disk Size:${CL}   ${YW}${DISK_SIZE}GB${CL}"
  echo -e "  ${GN}CPU Cores:${CL}   ${YW}${CORE_COUNT}${CL}"
  echo -e "  ${GN}RAM:${CL}         ${YW}${RAM_SIZE}MB${CL}"
  echo -e "  ${GN}Bridge:${CL}      ${YW}${BRG}${CL}"
  echo -e "  ${GN}Storage:${CL}     ${YW}${STORAGE}${CL}"
  echo ""
}

advanced_settings() {
  echo -e "\n${BL}Advanced Settings${CL}\n"

  read -r -p "  CT ID [${DEFAULT_CT_ID}]: " CT_ID
  CT_ID=${CT_ID:-$DEFAULT_CT_ID}

  read -r -p "  Hostname [${DEFAULT_HN}]: " HN
  HN=${HN:-$DEFAULT_HN}

  read -r -p "  Disk Size in GB [${DEFAULT_DISK_SIZE}]: " DISK_SIZE
  DISK_SIZE=${DISK_SIZE:-$DEFAULT_DISK_SIZE}

  read -r -p "  CPU Cores [${DEFAULT_CORE_COUNT}]: " CORE_COUNT
  CORE_COUNT=${CORE_COUNT:-$DEFAULT_CORE_COUNT}

  read -r -p "  RAM in MB [${DEFAULT_RAM_SIZE}]: " RAM_SIZE
  RAM_SIZE=${RAM_SIZE:-$DEFAULT_RAM_SIZE}

  read -r -p "  Network Bridge [${DEFAULT_BRG}]: " BRG
  BRG=${BRG:-$DEFAULT_BRG}

  read -r -p "  Gateway IP (leave empty for DHCP) []: " GATE

  # List available storages
  echo ""
  echo -e "  ${BL}Available storages:${CL}"
  pvesm status -content rootdir 2>/dev/null | awk 'NR>1 {printf "    - %s (%s)\n", $1, $2}'
  echo ""
  read -r -p "  Storage [${DEFAULT_STORAGE}]: " STORAGE
  STORAGE=${STORAGE:-$DEFAULT_STORAGE}

  echo ""
  echo -e "  ${GN}CT ID:${CL}       ${YW}${CT_ID}${CL}"
  echo -e "  ${GN}Hostname:${CL}    ${YW}${HN}${CL}"
  echo -e "  ${GN}Disk Size:${CL}   ${YW}${DISK_SIZE}GB${CL}"
  echo -e "  ${GN}CPU Cores:${CL}   ${YW}${CORE_COUNT}${CL}"
  echo -e "  ${GN}RAM:${CL}         ${YW}${RAM_SIZE}MB${CL}"
  echo -e "  ${GN}Bridge:${CL}      ${YW}${BRG}${CL}"
  echo -e "  ${GN}Storage:${CL}     ${YW}${STORAGE}${CL}"
  echo ""
}

# ──────────────────────────────────────────────
# Download Template
# ──────────────────────────────────────────────
download_template() {
  local TEMPLATE_STORAGE="local"
  local TEMPLATE="debian-12-standard_12.7-1_amd64.tar.zst"

  # Check if template exists
  if pveam list "$TEMPLATE_STORAGE" 2>/dev/null | grep -q "debian-12"; then
    TEMPLATE=$(pveam list "$TEMPLATE_STORAGE" 2>/dev/null | grep "debian-12" | tail -1 | awk '{print $1}')
    msg_ok "Debian 12 template found: ${TEMPLATE}"
    return
  fi

  msg_info "Downloading Debian 12 LXC template"
  pveam update &>/dev/null || true

  # Find the latest Debian 12 template
  local available
  available=$(pveam available --section system 2>/dev/null | grep "debian-12" | tail -1 | awk '{print $2}')
  if [[ -z "$available" ]]; then
    msg_error "Could not find Debian 12 template. Please download it manually."
    echo -e "  Run: ${GN}pveam download local debian-12-standard_12.7-1_amd64.tar.zst${CL}"
    exit 1
  fi

  TEMPLATE="${TEMPLATE_STORAGE}:vztmpl/${available}"
  pveam download "$TEMPLATE_STORAGE" "$available" &>/dev/null
  msg_ok "Downloaded Debian 12 template"
}

get_template_path() {
  local TEMPLATE_STORAGE="local"
  pveam list "$TEMPLATE_STORAGE" 2>/dev/null | grep "debian-12" | tail -1 | awk '{print $1}'
}

# ──────────────────────────────────────────────
# Build Container
# ──────────────────────────────────────────────
build_container() {
  local TEMPLATE
  TEMPLATE=$(get_template_path)

  if [[ -z "$TEMPLATE" ]]; then
    msg_error "No Debian 12 template found."
    exit 1
  fi

  msg_info "Creating LXC Container (CT ${CT_ID})"

  # Build network string
  local NET_STR="name=eth0,bridge=${BRG}"
  if [[ -n "$GATE" ]]; then
    NET_STR+=",gw=${GATE}"
  fi
  NET_STR+=",ip=dhcp"

  # Create the container
  pct create "$CT_ID" "$TEMPLATE" \
    --hostname "$HN" \
    --rootfs "${STORAGE}:${DISK_SIZE}" \
    --cores "$CORE_COUNT" \
    --memory "$RAM_SIZE" \
    --swap 512 \
    --net0 "$NET_STR" \
    --unprivileged 1 \
    --features nesting=1 \
    --onboot 1 \
    --start 0 \
    &>/dev/null

  msg_ok "Created LXC Container (CT ${CT_ID})"
}

# ──────────────────────────────────────────────
# Generate Install Script
# ──────────────────────────────────────────────
generate_install_script() {
  cat <<'INSTALL_SCRIPT_EOF'
#!/usr/bin/env bash

# HTML-to-PDF Platform - Installation Script (embedded)

set -euo pipefail

GN="\033[1;92m"
YW="\033[33m"
RD="\033[01;31m"
CL="\033[m"

msg_info() { echo -e "  [${YW}...${CL}] $1"; }
msg_ok()   { echo -e "  [${GN} OK${CL}] $1"; }
msg_error(){ echo -e "  [${RD}FAIL${CL}] $1"; }

APP_NAME="html-to-pdf"
APP_DIR="/opt/html-to-pdf"
REPO_URL="https://github.com/Julian612/html-to-pdf-platform.git"
NODE_MAJOR=20
APP_PORT=3000

if [[ "$(id -u)" -ne 0 ]]; then
  msg_error "This script must be run as root."
  exit 1
fi

echo ""
echo -e "${GN}========================================${CL}"
echo -e "${GN}  HTML-to-PDF Platform Installer${CL}"
echo -e "${GN}========================================${CL}"
echo ""

# 1. System Update & Base Packages
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
  2>/dev/null || true
msg_ok "Base dependencies installed"

# 2. Install Node.js 20 LTS
msg_info "Installing Node.js ${NODE_MAJOR}.x LTS"
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt "$NODE_MAJOR" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - &>/dev/null
  apt-get install -y -qq nodejs &>/dev/null
fi
msg_ok "Node.js $(node -v) installed"
msg_ok "npm $(npm -v) installed"

# 3. Install Chromium & Dependencies
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

# 4. Clone Repository
msg_info "Cloning HTML-to-PDF Platform"
if [[ -d "$APP_DIR" ]]; then
  rm -rf "$APP_DIR"
fi
git clone --depth 1 "$REPO_URL" "$APP_DIR" &>/dev/null
msg_ok "Repository cloned to ${APP_DIR}"

# 5. Install npm Dependencies
msg_info "Installing npm dependencies (this may take a few minutes)"
cd "$APP_DIR"
npm install --production=false 2>&1 | tail -1
msg_ok "npm dependencies installed"

# 6. Configure Environment
msg_info "Configuring environment"
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

# Generate bcrypt hash and write admin.json
msg_info "Setting up admin account"
ADMIN_HASH=$(node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('${ADMIN_PASSWORD}', 12, (err, hash) => {
  if (err) { process.stderr.write(err.message); process.exit(1); }
  process.stdout.write(hash);
});
" 2>/dev/null)

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

# 7. Build Application
msg_info "Building Next.js application (this may take a while)"
cd "$APP_DIR"
npm run build 2>&1 | tail -3
msg_ok "Application built successfully"

# 8. Create Systemd Service
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

# 9. Start Service
msg_info "Starting HTML-to-PDF service"
systemctl start html-to-pdf.service
sleep 3

if systemctl is-active --quiet html-to-pdf.service; then
  msg_ok "Service is running"
else
  msg_error "Service failed to start. Check: journalctl -u html-to-pdf -n 50"
fi

# 10. Cleanup
msg_info "Cleaning up"
apt-get autoremove -y -qq &>/dev/null
apt-get clean &>/dev/null
msg_ok "Cleanup complete"

# Done
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
INSTALL_SCRIPT_EOF
}

# ──────────────────────────────────────────────
# Run Install Script Inside Container
# ──────────────────────────────────────────────
run_install() {
  msg_info "Starting container ${CT_ID}"
  pct start "$CT_ID"
  sleep 5
  msg_ok "Container started"

  msg_info "Waiting for network"
  local max_wait=60
  local waited=0
  while ! pct exec "$CT_ID" -- ping -c1 -W2 8.8.8.8 &>/dev/null; do
    sleep 2
    waited=$((waited + 2))
    if [[ $waited -ge $max_wait ]]; then
      msg_error "Container has no network connectivity after ${max_wait}s"
      echo -e "  Check your network bridge (${BRG}) and DHCP configuration."
      exit 1
    fi
  done
  msg_ok "Network is up"

  msg_info "Preparing installation script"
  local TMP_SCRIPT
  TMP_SCRIPT=$(mktemp /tmp/html-to-pdf-install-XXXXXX.sh)
  generate_install_script > "$TMP_SCRIPT"
  msg_ok "Installation script prepared"

  msg_info "Copying installation script into container"
  pct push "$CT_ID" "$TMP_SCRIPT" /tmp/html-to-pdf-install.sh
  rm -f "$TMP_SCRIPT"
  msg_ok "Script copied into container"

  msg_info "Running installation inside container (this will take a while)"
  pct exec "$CT_ID" -- bash /tmp/html-to-pdf-install.sh
  msg_ok "Installation complete"
}

# ──────────────────────────────────────────────
# Get Container IP
# ──────────────────────────────────────────────
get_ct_ip() {
  pct exec "$CT_ID" -- bash -c "hostname -I 2>/dev/null | awk '{print \$1}'" 2>/dev/null || echo "unknown"
}

# ──────────────────────────────────────────────
# Completion Message
# ──────────────────────────────────────────────
completion_msg() {
  local IP
  IP=$(get_ct_ip)

  echo ""
  echo -e "${GN}================================================================${CL}"
  echo -e "${GN}  ${APP} Platform - Installation Complete!${CL}"
  echo -e "${GN}================================================================${CL}"
  echo ""
  echo -e "  ${BL}Web Interface:${CL}  ${GN}http://${IP}:3000${CL}"
  echo -e "  ${BL}Admin Panel:${CL}    ${GN}http://${IP}:3000/admin${CL}"
  echo -e "  ${BL}API Endpoint:${CL}   ${GN}http://${IP}:3000/api/convert${CL}"
  echo -e "  ${BL}API Docs:${CL}       ${GN}http://${IP}:3000/api-docs${CL}"
  echo -e "  ${BL}Container ID:${CL}   ${YW}${CT_ID}${CL}"
  echo ""
  echo -e "  ${YW}Admin Credentials:${CL} admin / (see install output above)"
  echo -e "  ${YW}API Key & Config:${CL}   pct exec ${CT_ID} -- cat /opt/html-to-pdf/.env"
  echo -e "  ${YW}Change password:${CL}    Login at /admin → API & Sicherheit"
  echo -e "  ${YW}Then restart:${CL}       pct exec ${CT_ID} -- systemctl restart html-to-pdf"
  echo ""
  echo -e "  ${BL}Service Management:${CL}"
  echo -e "    pct exec ${CT_ID} -- systemctl status html-to-pdf"
  echo -e "    pct exec ${CT_ID} -- systemctl restart html-to-pdf"
  echo -e "    pct exec ${CT_ID} -- journalctl -u html-to-pdf -f"
  echo ""
  echo -e "${GN}================================================================${CL}"
  echo ""
}

# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
main() {
  header_info
  check_root
  check_proxmox
  detect_storage

  echo -e "\nThis script will create an LXC container with the ${GN}${APP} Platform${CL}."
  echo ""
  echo -e "  ${BL}(1)${CL} Use default settings"
  echo -e "  ${BL}(2)${CL} Advanced settings (customize CT ID, resources, network, ...)"
  echo ""
  read -r -p "  Choose [1/2]: " choice

  case "$choice" in
    2) advanced_settings ;;
    *) default_settings ;;
  esac

  read -r -p "  Create container with these settings? [y/N]: " confirm
  if [[ ! "$confirm" =~ ^[yYjJ]$ ]]; then
    echo -e "\n  ${YW}Aborted.${CL}\n"
    exit 0
  fi

  download_template
  build_container
  run_install
  completion_msg
}

main "$@"
