# 🚀 Deploy Kingdom Collective to Vercel

## ✅ **Step 1: Verify Local Build**

Your website has been successfully built! The build completed without errors.

## 📋 **Step 2: Create GitHub Repository**

1. **Go to GitHub.com** and sign in
2. **Click "New repository"**
3. **Repository name**: `kingdom-collective-website`
4. **Description**: `Kingdom Collective - Official Marketing Website`
5. **Make it Public** (Vercel works better with public repos)
6. **Don't initialize** with README (we already have files)
7. **Click "Create repository"**

## 🔧 **Step 3: Push to GitHub**

Open PowerShell in the `kingdom-website` folder and run:

```powershell
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial Kingdom Collective website build"

# Set main branch
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/kingdom-collective-website.git

# Push to GitHub
git push -u origin main
```

## 🌐 **Step 4: Deploy to Vercel**

1. **Go to vercel.com** and sign in with GitHub
2. **Click "New Project"**
3. **Import your repository**: `kingdom-collective-website`
4. **Framework Preset**: Next.js (should auto-detect)
5. **Root Directory**: `./` (leave as default)
6. **Build Command**: `npm run build` (should auto-detect)
7. **Output Directory**: `.next` (should auto-detect)
8. **Install Command**: `npm install` (should auto-detect)
9. **Click "Deploy"**

## ⚙️ **Step 5: Configure Environment Variables**

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

```
NEXT_PUBLIC_APP_URL=https://kingdomcollective.pro
NEXT_PUBLIC_API_URL=https://api.kingdomcollective.pro
NEXT_PUBLIC_STORE_URL=https://desitotrh.com
```

## 🌍 **Step 6: Add Custom Domain**

1. **In Vercel dashboard**, go to **Settings > Domains**
2. **Add domain**: `kingdomcollective.pro`
3. **Vercel will provide DNS records** to add to GoDaddy:

### **DNS Records for GoDaddy:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.19.34 |
| CNAME | www | cname.vercel-dns.com |
| CNAME | app | cname.vercel-dns.com |
| CNAME | clips | cname.vercel-dns.com |
| CNAME | voice | cname.vercel-dns.com |
| CNAME | launchpad | cname.vercel-dns.com |
| CNAME | circle | cname.vercel-dns.com |
| CNAME | lens | cname.vercel-dns.com |
| CNAME | mantle | cname.vercel-dns.com |
| CNAME | chatbots | cname.vercel-dns.com |

## ✅ **Step 7: Verify Deployment**

Your site will be live at:
- **Vercel URL**: `https://kingdom-collective-website.vercel.app`
- **Custom Domain**: `https://kingdomcollective.pro` (after DNS setup)

## 🔄 **Step 8: Continuous Deployment**

Every time you push to GitHub, Vercel will automatically redeploy!

## 📱 **Step 9: Test All Pages**

Visit and test:
- ✅ Homepage: `/`
- ✅ Privacy Policy: `/privacy`
- ✅ Terms of Service: `/terms`
- ✅ Pricing: `/pricing`

## 🎯 **Step 10: Performance Check**

Your site should score:
- **Lighthouse Performance**: 90+ 
- **SEO**: 100
- **Accessibility**: 95+
- **Best Practices**: 95+

## 🚨 **Troubleshooting**

### **If build fails:**
1. Check that all dependencies are in `package.json`
2. Verify `next.config.js` is correct
3. Ensure all imports are working

### **If domain doesn't work:**
1. Wait 24-48 hours for DNS propagation
2. Check DNS records in GoDaddy
3. Verify domain is added in Vercel

### **If pages don't load:**
1. Check environment variables
2. Verify file paths in components
3. Check browser console for errors

## 🎉 **Success!**

Your Kingdom Collective website is now live and ready to serve your community!

**Next Steps:**
- Set up Google Analytics
- Configure email forms
- Add social media links
- Test on mobile devices
- Set up monitoring

---

*"Unless the Lord builds the house, the builders labor in vain." - Psalm 127:1*

**Build your Kingdom with purpose, authority, and excellence.** 🏰✨ 