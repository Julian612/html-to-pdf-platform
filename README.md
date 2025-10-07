# 🚀 HTML to PDF Platform

**Professional HTML-to-PDF conversion service with API access for automation platforms like n8n and Make.com.**

Perfect for IT businesses offering PDF generation services to clients!

---

## ✨ What's Included

### 🌐 Web-Based Tools (23+ Tools)
- **PDF Tools:** Merge, split, rotate, watermark, extract pages
- **Image Tools:** Compress, convert, resize, apply filters
- **File Tools:** ZIP/unZIP files
- **Utilities:** QR code generator, password generator, Base64 encoder
- All processing happens in the browser (privacy-friendly)

### ⚡ Professional API
- Convert HTML content to PDF
- Convert web URLs to PDF
- Full HTML/CSS rendering (uses Chrome engine)
- Custom page sizes, margins, headers, footers
- Ready for n8n and Make.com automation

---

## 🎯 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Locally
```bash
npm run dev
```
Open browser: `http://localhost:3000`

### Step 3: Deploy to Production
See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for step-by-step Vercel deployment.

**What You Need:**
- Vercel Pro account ($20/month)
- GitHub account (free)
- 10 minutes of your time

---

## 📚 Using the API

After deployment, your platform includes:
- **Full Documentation:** Visit `/api-docs` on your deployed site
- **Interactive Tester:** Visit `/api-tester` to test without code
- **Integration Guides:** Visit `/integrations/n8n` and `/integrations/make`

### Simple Example
```bash
curl -X POST https://your-domain.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"html": "<h1>Hello World</h1>", "format": "A4"}' \
  --output document.pdf
```

**Authentication:** Include `X-API-Key: your-api-key` in all API requests.

---

## 🔧 Technical Details

**Built With:**
- Next.js 13 (React framework)
- TypeScript
- Tailwind CSS
- Puppeteer (Chrome automation)
- pdf-lib, pdfjs-dist
- Vercel hosting

**No Database Required:** All processing happens in-memory (stateless).

---

## 💼 For Your Business

### Managing Customers

**Option 1: Single API Key (Simplest)**
- One key for all customers
- Easy to manage

**Option 2: Multiple API Keys**
- One key per customer
- Better tracking
- Edit `lib/api-utils.ts` to add keys

### Suggested Pricing
- **Basic:** $29/month (500 conversions)
- **Pro:** $79/month (2,000 conversions)  
- **Enterprise:** $199/month (10,000 conversions)

**Your Cost:** $20/month (Vercel Pro)

---

## 📊 Monitoring

Track everything in Vercel Dashboard:
- API request count
- Bandwidth usage
- Execution time
- Error logs

---

## 🔒 Security

✅ API key authentication  
✅ HTTPS encryption (automatic)  
✅ No file storage  
✅ Input validation  
✅ Chrome sandboxing

---

## 📞 Support Resources

- **Deployment Help:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **API Docs:** Visit `/api-docs` after deployment
- **Vercel Support:** https://vercel.com/support

---

## ✅ Ready to Deploy?

Follow the **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for step-by-step instructions.

**You'll be live in 10 minutes!**
