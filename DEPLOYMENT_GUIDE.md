# 🚀 Kingdom Collective Website - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Required Setup
- [ ] Node.js 18+ installed
- [ ] Git repository created
- [ ] Vercel account created
- [ ] Domain `kingdomcollective.pro` purchased
- [ ] GoDaddy account for DNS management

### ✅ Environment Variables
- [ ] Copy `env-template.txt` to `.env.local`
- [ ] Fill in all required API keys
- [ ] Test local development server

## 🌐 Vercel Deployment

### Step 1: Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project directory
cd kingdom-website
```

### Step 2: Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### Step 3: Configure Project Settings

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click "Settings" tab

2. **Set Environment Variables**
   ```
   NEXT_PUBLIC_APP_URL=https://kingdomcollective.pro
   NEXT_PUBLIC_API_URL=https://api.kingdomcollective.pro
   NEXT_PUBLIC_STORE_URL=https://desitotrh.com
   ```

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## 🔗 Domain Configuration

### Step 1: Add Domain to Vercel

1. **In Vercel Dashboard**
   - Go to "Domains" section
   - Add `kingdomcollective.pro`
   - Add subdomains:
     - `app.kingdomcollective.pro`
     - `clips.kingdomcollective.pro`
     - `voice.kingdomcollective.pro`
     - `launchpad.kingdomcollective.pro`
     - `circle.kingdomcollective.pro`
     - `lens.kingdomcollective.pro`
     - `mantle.kingdomcollective.pro`
     - `chatbots.kingdomcollective.pro`

### Step 2: Configure DNS in GoDaddy

1. **Log into GoDaddy**
   - Navigate to DNS management
   - Find `kingdomcollective.pro` domain

2. **Add Vercel DNS Records**
   ```
   Type: A
   Name: @
   Value: 76.76.19.19
   TTL: 600
   ```

3. **Add CNAME Records for Subdomains**
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   TTL: 600
   ```
   
   Repeat for each subdomain:
   - `clips` → `cname.vercel-dns.com`
   - `voice` → `cname.vercel-dns.com`
   - `launchpad` → `cname.vercel-dns.com`
   - `circle` → `cname.vercel-dns.com`
   - `lens` → `cname.vercel-dns.com`
   - `mantle` → `cname.vercel-dns.com`
   - `chatbots` → `cname.vercel-dns.com`

### Step 3: Verify DNS Propagation

```bash
# Check DNS propagation
nslookup kingdomcollective.pro
nslookup app.kingdomcollective.pro
nslookup clips.kingdomcollective.pro
# ... repeat for all subdomains
```

## 🔧 Environment Variables Setup

### Required Variables

Create `.env.local` file with:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://kingdomcollective.pro
NEXT_PUBLIC_API_URL=https://api.kingdomcollective.pro
NEXT_PUBLIC_STORE_URL=https://desitotrh.com

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXX

# Development
NODE_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false
```

### Vercel Environment Variables

Set these in Vercel dashboard:

1. **Go to Project Settings**
2. **Environment Variables section**
3. **Add each variable**:
   - `NEXT_PUBLIC_APP_URL` = `https://kingdomcollective.pro`
   - `NEXT_PUBLIC_API_URL` = `https://api.kingdomcollective.pro`
   - `NEXT_PUBLIC_STORE_URL` = `https://desitotrh.com`

## 🧪 Testing Deployment

### Step 1: Test Main Domain
```bash
# Test homepage
curl -I https://kingdomcollective.pro

# Test privacy page
curl -I https://kingdomcollective.pro/privacy

# Test terms page
curl -I https://kingdomcollective.pro/terms
```

### Step 2: Test Subdomains
```bash
# Test each subdomain
curl -I https://app.kingdomcollective.pro
curl -I https://clips.kingdomcollective.pro
curl -I https://voice.kingdomcollective.pro
curl -I https://launchpad.kingdomcollective.pro
curl -I https://circle.kingdomcollective.pro
curl -I https://lens.kingdomcollective.pro
curl -I https://mantle.kingdomcollective.pro
curl -I https://chatbots.kingdomcollective.pro
```

### Step 3: Browser Testing
- [ ] Homepage loads correctly
- [ ] Navigation works on mobile
- [ ] App cards are interactive
- [ ] Store iframe loads
- [ ] Privacy page accessible
- [ ] Terms page accessible
- [ ] Footer links work
- [ ] Faith Mode toggle works

## 🔒 Security Configuration

### SSL Certificate
- Vercel automatically provides SSL certificates
- Verify HTTPS is working on all domains

### Security Headers
Already configured in `vercel.json`:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## 📊 Analytics Setup

### Google Analytics
1. Create Google Analytics 4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables
4. Verify tracking in Google Analytics dashboard

### Facebook Pixel
1. Create Facebook Business Manager account
2. Create Facebook Pixel
3. Get Pixel ID
4. Add to environment variables

### TikTok Pixel
1. Create TikTok Ads account
2. Create TikTok Pixel
3. Get Pixel ID
4. Add to environment variables

## 🚀 Performance Optimization

### Build Optimization
```bash
# Build for production
npm run build

# Check bundle size
npm run analyze
```

### Image Optimization
- All images are optimized by Next.js
- Use WebP format where possible
- Implement lazy loading

### Caching Strategy
- Static pages cached at edge
- API routes cached appropriately
- CDN distribution via Vercel

## 🔄 Continuous Deployment

### GitHub Integration
1. **Connect GitHub repository**
   - Go to Vercel project settings
   - Connect to GitHub
   - Select repository

2. **Configure auto-deploy**
   - Deploy on push to main branch
   - Create preview deployments for PRs

### Deployment Triggers
- Push to `main` branch → Production deployment
- Pull request → Preview deployment
- Manual deployment via Vercel CLI

## 📱 Mobile Optimization

### Responsive Design
- Test on various screen sizes
- Verify touch interactions
- Check loading performance

### PWA Features (Optional)
- Add manifest.json
- Configure service worker
- Enable offline functionality

## 🐛 Troubleshooting

### Common Issues

1. **DNS Not Propagating**
   ```bash
   # Wait 24-48 hours for full propagation
   # Check with multiple DNS lookup tools
   ```

2. **Build Failures**
   ```bash
   # Check build logs in Vercel
   # Verify all dependencies are installed
   # Test locally first
   ```

3. **Environment Variables Not Working**
   ```bash
   # Verify variables are set in Vercel dashboard
   # Check for typos in variable names
   # Restart deployment after changes
   ```

4. **Subdomain Not Working**
   ```bash
   # Verify CNAME record in GoDaddy
   # Check DNS propagation
   # Verify subdomain is added to Vercel
   ```

### Debug Commands
```bash
# Test local build
npm run build

# Test local server
npm run start

# Check environment variables
echo $NEXT_PUBLIC_APP_URL

# Test DNS resolution
dig kingdomcollective.pro
```

## 📞 Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Status: https://vercel-status.com

### Domain Support
- GoDaddy Support: https://www.godaddy.com/help
- DNS Management: https://www.godaddy.com/help/manage-dns-records-680

### Technical Support
- Email: support@kingdomcollective.pro
- Documentation: [Link to docs]
- GitHub Issues: [Repository issues]

---

**Deployment Status: Ready for Production** 🚀

*"Unless the Lord builds the house, the builders labor in vain." - Psalm 127:1* 