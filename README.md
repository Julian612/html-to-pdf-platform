# HTML to PDF Platform

**Professional HTML-to-PDF conversion service with API access for automation platforms like n8n and Make.com.**

---

## What's Included

### Web-Based Tools (23+ Tools)
- **PDF Tools:** Merge, split, rotate, watermark, extract pages
- **Image Tools:** Compress, convert, resize, apply filters
- **File Tools:** ZIP/unZIP files
- **Utilities:** QR code generator, password generator, Base64 encoder
- All processing happens in the browser (privacy-friendly)

### Professional API
- Convert HTML content to PDF
- Convert web URLs to PDF
- Full HTML/CSS rendering (uses Chrome engine)
- Custom page sizes, margins, headers, footers
- Ready for n8n and Make.com automation

---

## Installation

### Option A: Proxmox VE (Helper Script)

Install as an LXC container on Proxmox VE with a single command. Run this on the **Proxmox host**:

```bash
bash -c "$(wget -qLO - https://raw.githubusercontent.com/Julian612/html-to-pdf-platform/main/ct/html-to-pdf.sh)"
```

This will:
- Create a Debian 12 LXC container
- Install Node.js 20, Chromium, and all dependencies
- Build the application and configure it as a systemd service
- Generate a random API key
- Start the service on port 3000

**Default Resources:** 2 CPU cores, 2 GB RAM, 6 GB disk (customizable during setup).

After installation, access the platform at `http://<container-ip>:3000`.

### Option B: Standalone Installation (Debian/Ubuntu)

Run directly on any Debian/Ubuntu machine or VM:

```bash
wget -qO- https://raw.githubusercontent.com/Julian612/html-to-pdf-platform/main/install/html-to-pdf-install.sh | bash
```

Or clone and run manually:

```bash
git clone https://github.com/Julian612/html-to-pdf-platform.git
cd html-to-pdf-platform
sudo bash install/html-to-pdf-install.sh
```

### Option C: Manual / Development Setup

```bash
npm install
cp env.example .env   # Edit .env and set your API_KEY
npm run dev            # Development at http://localhost:3000
```

### Option D: Vercel (Serverless)

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for Vercel deployment.

---

## Service Management (Proxmox / Standalone)

```bash
# Check status
systemctl status html-to-pdf

# Restart after config changes
systemctl restart html-to-pdf

# View live logs
journalctl -u html-to-pdf -f

# Edit configuration
nano /opt/html-to-pdf/.env
```

---

## Using the API

After installation, your platform includes:
- **Full Documentation:** Visit `/api-docs` on your site
- **Interactive Tester:** Visit `/api-tester` to test without code
- **Integration Guides:** Visit `/integrations/n8n` and `/integrations/make`

### Example
```bash
curl -X POST http://<your-ip>:3000/api/convert \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"html": "<h1>Hello World</h1>", "format": "A4"}' \
  --output document.pdf
```

**Authentication:** Include `X-API-Key: your-api-key` in all API requests.

---

## Configuration

The configuration file is at `/opt/html-to-pdf/.env` (self-hosted) or `.env` (manual/Vercel):

| Variable | Description | Default |
|---|---|---|
| `API_KEY` | API authentication key | *(generated on install)* |
| `DEPLOYMENT_MODE` | `selfhosted` or unset for Vercel | *(unset)* |
| `CHROME_PATH` | Path to Chromium binary | `/usr/bin/chromium` |
| `PORT` | Server port | `3000` |
| `RATE_LIMIT_REQUESTS` | Requests per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `3600000` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` |

---

## Technical Details

**Built With:**
- Next.js 13 (React framework)
- TypeScript
- Tailwind CSS
- Puppeteer (Chrome/Chromium automation)
- pdf-lib, pdfjs-dist

**Deployment Modes:**
- **Self-hosted** (Proxmox LXC, bare metal, VM): Uses system Chromium
- **Serverless** (Vercel): Uses `@sparticuz/chromium`

**No Database Required:** All processing happens in-memory (stateless).

---

## Security

- API key authentication
- HTTPS encryption (configure with reverse proxy for self-hosted)
- No file storage on server
- Input validation
- Chrome sandboxing

---

## Support

- **Proxmox Install Script:** `ct/html-to-pdf.sh`
- **Standalone Install Script:** `install/html-to-pdf-install.sh`
- **Vercel Deployment:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **API Docs:** Visit `/api-docs` after deployment
