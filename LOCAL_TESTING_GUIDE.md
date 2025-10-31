# 🧪 LOCAL TESTING GUIDE - Kingdom Manifesto Implementation

**Date**: October 25, 2025  
**Status**: Testing all 11 critical implementations locally

---

## 🚀 Dev Server Status

✅ **Dev server starting**: `npm run dev` in kingdom-website  
🌐 **URL**: http://localhost:3000

---

## ✅ TESTING CHECKLIST (10 Tests)

### 1. 🗺️ Test Sitemap.xml (SEO)

**URL**: http://localhost:3000/sitemap.xml

**What to verify**:

- [ ] XML file loads (not 404)
- [ ] Contains all 10 pages:
  - `/` (homepage)
  - `/kingdom-stand`
  - `/kingdom-circle`
  - `/kingdom-clips`
  - `/kingdom-launchpad`
  - `/kingdom-lens`
  - `/kingdom-voice`
  - `/privacy`
  - `/terms`
  - `/ai-bots/sales-assistant`
- [ ] Each URL has `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- [ ] Priority is 1.0 for homepage, 0.8 for others
- [ ] baseUrl is `https://kingdomcollective.pro`

**Expected Output**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kingdomcollective.pro</loc>
    <lastmod>2025-10-25T...</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

---

### 2. 🤖 Test robots.txt (SEO)

**URL**: http://localhost:3000/robots.txt

**What to verify**:

- [ ] File loads as plain text
- [ ] Contains `User-agent: *`
- [ ] Contains `Allow: /`
- [ ] Contains `Disallow: /api/`
- [ ] Contains `Disallow: /_next/`
- [ ] Contains `Sitemap: https://kingdomcollective.pro/sitemap.xml`
- [ ] Contains crawl delay for bots

**Expected Output**:

```
# Kingdom Collective - Robots.txt
User-agent: *
Allow: /

Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: https://kingdomcollective.pro/sitemap.xml
...
```

---

### 3. 📋 Test JSON-LD Schema (SEO)

**URL**: http://localhost:3000  
**Method**: View Page Source (Ctrl+U or right-click → View Source)

**What to verify**:

- [ ] Page source contains `<script type="application/ld+json">`
- [ ] Two JSON-LD blocks present:
  1. **Organization Schema**:
     - `@type: "Organization"`
     - `name: "Kingdom Collective"`
     - `url`, `logo`, `description`, `sameAs`, `contactPoint`
  2. **WebSite Schema**:
     - `@type: "WebSite"`
     - `name: "Kingdom Collective"`
     - `potentialAction` with SearchAction

**How to find**:

1. Open http://localhost:3000
2. Press `Ctrl+U` (or `Cmd+U` on Mac)
3. Search for `application/ld+json` (Ctrl+F)
4. You should find 2 script blocks

**Expected in source**:

```html
<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Organization","name":"Kingdom Collective",...}
</script>
<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebSite","name":"Kingdom Collective",...}
</script>
```

---

### 4. 🔗 Test Canonical URLs (SEO)

**URL**: http://localhost:3000  
**Method**: View Page Source

**What to verify**:

- [ ] Contains `<link rel="canonical" href="https://kingdomcollective.pro/" />`
- [ ] Test on other pages:
  - `/kingdom-stand` → canonical: `https://kingdomcollective.pro/kingdom-stand`
  - `/privacy` → canonical: `https://kingdomcollective.pro/privacy`

**How to test**:

1. Visit http://localhost:3000
2. View source (Ctrl+U)
3. Search for `rel="canonical"`
4. Verify URL matches page URL (no query params)

---

### 5. 🍪 Test Cookie Consent Banner (Legal/GDPR)

**URL**: http://localhost:3000

**What to verify**:

- [ ] Banner appears at bottom of page on first visit
- [ ] Contains:
  - [ ] Title: "🍪 Cookie Preferences"
  - [ ] Description text about cookies
  - [ ] Link to `/privacy`
  - [ ] Three buttons:
    1. "Necessary Only" (white/transparent)
    2. "Customize" (gold)
    3. "Accept All" (solid gold)
- [ ] Clicking "Accept All":
  - [ ] Banner disappears
  - [ ] localStorage contains `cookie-consent`
  - [ ] localStorage contains `cookie-consent-date`
- [ ] Refreshing page: banner should NOT appear again
- [ ] Clear localStorage and refresh: banner reappears

**How to test localStorage**:

1. Open DevTools (F12)
2. Go to "Application" tab → "Local Storage" → http://localhost:3000
3. After accepting, you should see:
   - `cookie-consent`: `{"necessary":true,"analytics":true,"marketing":true}`
   - `cookie-consent-date`: ISO timestamp

**To reset test**:

```javascript
// In browser console (F12)
localStorage.clear();
location.reload();
```

---

### 6. 💥 Test Custom 500 Error Page (UX)

**URL**: http://localhost:3000/500

**What to verify**:

- [ ] Page loads with:
  - [ ] Large "500" heading
  - [ ] "Server Error" title in gold
  - [ ] Error message about technical difficulties
  - [ ] Scripture: Psalm 28:7
  - [ ] "Return Home" button (gold)
  - [ ] Navigation bar
  - [ ] Footer
  - [ ] Background video
- [ ] "Return Home" button links to `/`
- [ ] Page styling matches Kingdom Collective branding

---

### 7. 🔒 Test Security Headers (Security)

**Method**: Browser DevTools Network Tab

**What to verify**:

- [ ] In Network tab, check response headers for any request:
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options`: `DENY`
  - `X-Content-Type-Options`: `nosniff`
  - `X-XSS-Protection`: `1; mode=block`
  - `Referrer-Policy`: `strict-origin-when-cross-origin`
  - `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy`: (should contain multiple directives)

**How to test**:

1. Open http://localhost:3000
2. Open DevTools (F12) → Network tab
3. Refresh page
4. Click on the first request (the HTML document)
5. Scroll down to "Response Headers"
6. Verify all 7 security headers are present

**Note**: In development mode, some headers might not appear. They'll be active in production build.

---

### 8. 🖼️ Test Image Optimization (Performance)

**Method**: Check Next.js Image component

**What to verify**:

- [ ] Images use Next.js `<Image>` component
- [ ] In DevTools Network tab:
  - [ ] Images load with modern formats (check Content-Type)
  - [ ] Images are appropriately sized (not full resolution for small displays)
  - [ ] Lazy loading works (images only load when scrolling near them)

**How to test**:

1. Open http://localhost:3000
2. Open DevTools → Network tab
3. Filter by "Img"
4. Scroll page and watch images load
5. Check that images have `?url=` query params (Next.js optimization)

**Before fix**: `images.unoptimized: true`  
**After fix**: `images.unoptimized: false` + WebP/AVIF support

---

### 9. 📱 Test Responsive Design (Accessibility)

**What to verify**:

- [ ] Cookie banner is responsive (stacks on mobile)
- [ ] 500 page works on mobile
- [ ] All new components work at different screen sizes:
  - Desktop: 1920px
  - Tablet: 768px
  - Mobile: 375px

**How to test**:

1. Open DevTools (F12)
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Test different device sizes
4. Check cookie banner, 500 page, and all pages

---

### 10. 🧪 Test All Pages Load

**URLs to test** (should all load without errors):

- [ ] http://localhost:3000 (Homepage)
- [ ] http://localhost:3000/kingdom-stand
- [ ] http://localhost:3000/kingdom-circle
- [ ] http://localhost:3000/kingdom-clips
- [ ] http://localhost:3000/kingdom-launchpad
- [ ] http://localhost:3000/kingdom-lens
- [ ] http://localhost:3000/kingdom-voice
- [ ] http://localhost:3000/privacy
- [ ] http://localhost:3000/terms
- [ ] http://localhost:3000/ai-bots/sales-assistant
- [ ] http://localhost:3000/sitemap.xml
- [ ] http://localhost:3000/robots.txt
- [ ] http://localhost:3000/500

---

## 🎯 QUICK TEST COMMANDS

### Browser Console Tests

```javascript
// Test 1: Check if cookie consent exists in DOM
document.querySelector('[class*="cookie"]') !== null;

// Test 2: Check canonical URL
document.querySelector('link[rel="canonical"]')?.href;

// Test 3: Check JSON-LD schemas
document.querySelectorAll('script[type="application/ld+json"]').length;
// Should return: 2

// Test 4: View JSON-LD data
Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(
  (s) => JSON.parse(s.textContent)
);

// Test 5: Check localStorage after cookie consent
localStorage.getItem("cookie-consent");

// Test 6: Clear cookies to re-test banner
localStorage.clear();
location.reload();
```

---

## 📊 EXPECTED RESULTS SUMMARY

| Feature                | Status | Location     | Verification                   |
| ---------------------- | ------ | ------------ | ------------------------------ |
| **Sitemap.xml**        | ✅     | /sitemap.xml | XML with 10 URLs               |
| **robots.txt**         | ✅     | /robots.txt  | Plain text file                |
| **JSON-LD Schema**     | ✅     | All pages    | 2 schemas in source            |
| **Canonical URLs**     | ✅     | All pages    | `<link rel="canonical">`       |
| **Cookie Banner**      | ✅     | First visit  | Bottom banner with 3 buttons   |
| **500 Error Page**     | ✅     | /500         | Custom branded page            |
| **Security Headers**   | ✅     | All requests | 7 headers in Network tab       |
| **Image Optimization** | ✅     | All images   | WebP/AVIF formats              |
| **Responsive Design**  | ✅     | All pages    | Works on mobile/tablet/desktop |
| **All Pages Load**     | ✅     | 13 URLs      | No 404 or errors               |

---

## 🐛 TROUBLESHOOTING

### Issue: Cookie banner doesn't appear

**Solution**:

```javascript
// Clear localStorage in browser console
localStorage.clear();
location.reload();
```

### Issue: Sitemap.xml shows 404

**Solution**:

- Check that `kingdom-website/pages/sitemap.xml.tsx` exists
- Restart dev server: `npm run dev`

### Issue: Images not optimized

**Solution**:

- Check `next.config.js`: `images.unoptimized` should be `false`
- Restart dev server

### Issue: Security headers not showing

**Solution**:

- Headers may not show in dev mode
- Test with production build: `npm run build && npm start`

### Issue: JSON-LD not in page source

**Solution**:

- Check `Layout.tsx` has `<OrganizationSchema />` and `<WebSiteSchema />`
- Check `StructuredData.tsx` exists
- Restart dev server

---

## 🏆 PRODUCTION BUILD TEST (Optional)

For more accurate testing (closer to production):

```bash
# In kingdom-website directory
npm run build
npm start

# Then test at http://localhost:3000
# This will show:
# - Accurate security headers
# - Optimized images
# - Production performance
```

---

## ✅ TESTING COMPLETE CHECKLIST

Once you've tested everything:

- [ ] ✅ Sitemap.xml loads with all 10 pages
- [ ] ✅ robots.txt loads correctly
- [ ] ✅ JSON-LD schemas appear in page source (2 schemas)
- [ ] ✅ Canonical URLs on all pages
- [ ] ✅ Cookie banner appears and works (localStorage saves)
- [ ] ✅ 500 error page displays correctly
- [ ] ✅ Security headers visible in Network tab
- [ ] ✅ Images optimize (WebP/AVIF)
- [ ] ✅ Responsive on mobile/tablet/desktop
- [ ] ✅ All 13 URLs load without errors
- [ ] ✅ Console shows no critical errors

**When all checked**: You're ready to deploy! 🚀

---

## 📞 NEXT STEPS AFTER TESTING

### If Tests Pass ✅

```bash
# Commit and deploy
git add .
git commit -m "feat: implement kingdom manifesto - achieve 95/100 score"
git push origin main
```

### If Issues Found ❌

Report which tests failed and we'll fix them before deploying.

---

**"Test everything; hold fast to what is good."** - 1 Thessalonians 5:21

**Testing in progress...** 🧪👑
