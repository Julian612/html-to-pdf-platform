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
INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/Julian612/html-to-pdf-platform/main/install/html-to-pdf-install.sh"

# Defaults
DEFAULT_CT_ID=$(next_id)
DEFAULT_HN="html-to-pdf"
DEFAULT_DISK_SIZE="6"
DEFAULT_CORE_COUNT="2"
DEFAULT_RAM_SIZE="2048"
DEFAULT_BRG="vmbr0"
DEFAULT_GATE=""
DEFAULT_APT_CACHER=""
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
  APT_CACHER=$DEFAULT_APT_CACHER
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
    --storage "$STORAGE" \
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
# Run Install Script Inside Container
# ──────────────────────────────────────────────
run_install() {
  msg_info "Starting container ${CT_ID}"
  pct start "$CT_ID"
  sleep 5
  msg_ok "Container started"

  msg_info "Waiting for network"
  local max_wait=30
  local waited=0
  while ! pct exec "$CT_ID" -- ping -c1 -W2 google.com &>/dev/null; do
    sleep 2
    waited=$((waited + 2))
    if [[ $waited -ge $max_wait ]]; then
      msg_error "Container has no network connectivity after ${max_wait}s"
      echo -e "  Check your network bridge (${BRG}) and DHCP configuration."
      exit 1
    fi
  done
  msg_ok "Network is up"

  msg_info "Running installation script inside container (this will take a while)"
  # Download and execute the install script inside the container
  pct exec "$CT_ID" -- bash -c "
    apt-get update -qq &&
    apt-get install -y -qq wget ca-certificates &>/dev/null &&
    wget -qO /tmp/install.sh '${INSTALL_SCRIPT_URL}' &&
    bash /tmp/install.sh
  "
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
  echo -e "  ${BL}API Endpoint:${CL}   ${GN}http://${IP}:3000/api/convert${CL}"
  echo -e "  ${BL}API Docs:${CL}       ${GN}http://${IP}:3000/api-docs${CL}"
  echo -e "  ${BL}Container ID:${CL}   ${YW}${CT_ID}${CL}"
  echo ""
  echo -e "  ${YW}Default API Key:${CL} Check /opt/html-to-pdf/.env inside the container"
  echo -e "  ${YW}Change it:${CL}       pct exec ${CT_ID} -- nano /opt/html-to-pdf/.env"
  echo -e "  ${YW}Then restart:${CL}    pct exec ${CT_ID} -- systemctl restart html-to-pdf"
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
