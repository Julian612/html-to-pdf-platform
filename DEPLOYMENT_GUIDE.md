# 🚀 Deployment Guide - Get Live in 10 Minutes!

Follow these simple steps to deploy your HTML to PDF platform to Vercel.

---

## ✅ What You Need

1. **Vercel Pro Account** ($20/month)
   - Required for HTML-to-PDF conversion
   - Sign up: https://vercel.com/pricing
   - ⚠️ Free tier will NOT work!

2. **GitHub Account** (Free)
   - Create at: https://github.com

---

## 📝 Step-by-Step Deployment

### 1️⃣ Upload Code to GitHub

**If you already have the code on GitHub, skip to Step 2.**

If not:
1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Name it: `html-to-pdf-platform`
4. Click "Create repository"
5. Follow GitHub's instructions to push your code

---

### 2️⃣ Deploy to Vercel

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Login" and sign in with GitHub

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Click "Import" next to your `html-to-pdf-platform` repository
   
3. **Configure Settings**
   - Vercel will auto-detect it's a Next.js project ✅
   - **IMPORTANT:** Before clicking "Deploy", do Step 3 below!

---

### 3️⃣ Add Your API Key

**⚠️ Do this BEFORE deploying!**

1. On the deployment screen, scroll to "Environment Variables"
2. Add this variable:
   - **Key:** `API_KEY`
   - **Value:** `sk_prod_YOUR_SECRET_KEY_12345` (make it random and secure!)
   - **Environments:** Check ALL boxes (Production, Preview, Development)
3. Click "Add"

**💡 Tip:** Generate a secure key at https://generate-secret.vercel.app/

---

### 4️⃣ Deploy!

1. Click the big blue "Deploy" button
2. Wait 3-5 minutes (grab a coffee ☕)
3. You'll see "Congratulations!" when done
4. Vercel gives you a URL like: `https://your-project.vercel.app`

---

## ✅ Test It Works

### Quick Test (No Code Required)

1. Visit: `https://your-project.vercel.app/api-tester`
2. Enter your API key (the one you created in Step 3)
3. Click "Convert to PDF"
4. **If a PDF downloads, you're live! 🎉**

### Test with Code
```bash
curl -X POST https://your-project.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"html": "<h1>Hello World</h1>"}' \
  --output test.pdf
```

---

## 🌐 Add Your Own Domain (Optional)

Want to use `pdf.yourcompany.com` instead of the Vercel URL?

1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Click "Add"
4. Enter your domain: `pdf.yourcompany.com`
5. Vercel shows you DNS settings
6. Go to your domain registrar (GoDaddy, Namecheap, etc.)
7. Add a CNAME record:
   - **Name:** `pdf`
   - **Value:** `cname.vercel-dns.com`
8. Wait 10-60 minutes
9. Done! Your API is at `https://pdf.yourcompany.com`

---

## 📊 Monitoring & Analytics

Track everything in your Vercel Dashboard:

1. Go to your Vercel project
2. Click "Analytics" to see:
   - Total API requests
   - Bandwidth usage
   - Function execution time
   - Error rates

**View Logs:** Click "Logs" to see real-time API calls and errors.

---

## 💰 Business Guide

### What You Can Charge Customers

- **Basic:** $29/month (500 conversions)
- **Pro:** $79/month (2,000 conversions)
- **Enterprise:** $199/month (10,000 conversions)

**Your Cost:** $20/month (Vercel Pro)  
**Profit:** With just 2 customers, you're profitable!

### Capacity

Vercel Pro ($20/month) includes:
- 1,000 GB-hours execution time
- 1 TB bandwidth
- **Can handle ~10,000-20,000 PDF conversions/month**

### Managing Multiple Customers

**Option 1: One API Key for All (Simplest)**
- Use the same key for all customers
- Easy to manage

**Option 2: One Key Per Customer**
- Edit `lib/api-utils.ts`
- Add keys to the validation function
- Push to GitHub (auto-deploys)

---

## 🔧 Making Updates

**Any changes you push to GitHub automatically deploy to Vercel!**

### To Update:
```bash
# 1. Make changes to your code locally
# 2. Push to GitHub
git add .
git commit -m "Updated XYZ"
git push

# 3. Vercel auto-deploys in ~2 minutes!
```

### Common Changes:
- **Branding:** Edit `app/page.tsx`
- **Colors:** Edit `app/globals.css`
- **API Logic:** Edit `app/api/convert/route.ts`

---

## ⚠️ Troubleshooting

### "API Key not configured"
→ Go to Vercel → Settings → Environment Variables  
→ Make sure `API_KEY` exists  
→ Redeploy

### "Failed to launch Chrome"
→ Verify you're on Vercel **Pro** plan (not Free)  
→ Contact Vercel support if it persists

### Slow conversions
→ Complex HTML takes longer (that's normal)  
→ Optimize images and external resources

### Customer can't connect
→ Verify they're using correct API key  
→ Check they include `X-API-Key` header  
→ Test with your API tester: `/api-tester`

## 🎉 You're Done!

**Congratulations! Your platform is now live and ready for customers.**

### What You Have:
✅ Professional HTML-to-PDF API  
✅ Web-based PDF tools  
✅ Complete documentation  
✅ n8n & Make.com integration guides  
✅ API testing tool  
✅ Monitoring dashboard

### Next Steps:
1. Test everything at `/api-tester`
2. Share API docs with customers: `/api-docs`
3. Start selling! 💰

---

## 📚 Important Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Support:** https://vercel.com/support
- **Documentation:** Visit `/api-docs` on your deployed site

---

## 🔒 Security Tips

✅ Keep your API keys secret  
✅ Never commit keys to GitHub  
✅ HTTPS is automatic (Vercel provides it free)  
✅ Monitor logs regularly  
✅ Rotate keys if compromised

---

**Need Help?** Contact Vercel support or hire a developer for custom modifications.
