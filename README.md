# 🏰 Kingdom Collective Website

A premium marketing website for Kingdom Collective, built with Next.js and Tailwind CSS. Features a dark, elegant design with glowing animations and comprehensive app ecosystem showcase.

## ✨ Features

- **Dark Premium Design**: Deep purples, electric violet, and soft gold color scheme
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Animated Hero Section**: Glowing text effects and floating elements
- **App Ecosystem Showcase**: Interactive cards for all Kingdom apps
- **Embedded Store**: Integrated Beacons storefront
- **Legal Pages**: Comprehensive Privacy Policy and Terms of Service
- **SEO Optimized**: Meta tags, Open Graph, and Twitter cards
- **Faith Mode Toggle**: Interactive feature for enhanced user experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd kingdom-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env-template.txt .env.local
   # Edit .env.local with your actual API keys
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
kingdom-website/
├── pages/                 # Next.js pages
│   ├── index.tsx         # Homepage
│   ├── privacy.tsx       # Privacy Policy
│   ├── terms.tsx         # Terms of Service
│   └── _app.tsx          # App wrapper
├── components/            # React components
│   ├── Layout.tsx        # Page layout wrapper
│   ├── Navigation.tsx    # Navigation bar
│   ├── Hero.tsx          # Hero section
│   ├── AppCard.tsx       # App showcase cards
│   └── Footer.tsx        # Footer component
├── styles/               # Global styles
│   └── globals.css       # Tailwind + custom styles
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
└── env-template.txt      # Environment variables template
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#1e3a8a`
- **Royal Blue**: `#3b82f6`
- **Sky Blue**: `#0ea5e9`
- **Gold**: `#fbbf24`
- **Amber**: `#f59e0b`
- **Dark Background**: `#0f172a`
- **Darker Elements**: `#1e293b`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Animations
- **Glow Effect**: Pulsing blue glow
- **Float Animation**: Gentle floating motion
- **Hover Effects**: Scale and shadow transitions

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure domain**
   - Add `kingdomcollective.pro` to your Vercel project
   - Update DNS records in GoDaddy

### Environment Variables

Set these in your Vercel dashboard:

```bash
# Required for production
NEXT_PUBLIC_APP_URL=https://kingdomcollective.pro
NEXT_PUBLIC_API_URL=https://api.kingdomcollective.pro
NEXT_PUBLIC_STORE_URL=https://desitotrh.com

# Optional (for enhanced features)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXX
```

## 🔗 Subdomain Configuration

The website is prepared for these subdomains:

- `app.kingdomcollective.pro` - Kingdom Studios
- `clips.kingdomcollective.pro` - Kingdom Clips
- `voice.kingdomcollective.pro` - Kingdom Voice
- `launchpad.kingdomcollective.pro` - Kingdom Launchpad
- `circle.kingdomcollective.pro` - Kingdom Circle
- `lens.kingdomcollective.pro` - Kingdom Lens
- `mantle.kingdomcollective.pro` - Kingdom Mantle
- `chatbots.kingdomcollective.pro` - Kingdom Chatbots

## 📱 SEO & Performance

### Meta Tags
- Open Graph tags for social sharing
- Twitter Card support
- Proper title and description tags
- Viewport and theme-color meta tags

### Performance
- Optimized images and assets
- Lazy loading for iframes
- Preconnect to external domains
- Responsive design for all devices

### Compliance
- GDPR compliant privacy policy
- CCPA ready terms of service
- Accessibility considerations
- Security headers configured

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Customization

1. **Colors**: Edit `tailwind.config.js` for color changes
2. **Content**: Update components in `components/` directory
3. **Styling**: Modify `styles/globals.css` for custom styles
4. **Pages**: Add new pages in `pages/` directory

## 📄 Legal Pages

### Privacy Policy
- Comprehensive data collection practices
- User rights and choices
- International data transfers
- Contact information

### Terms of Service
- Service description and usage
- Payment terms and refunds
- Intellectual property rights
- Limitation of liability

## 🎯 Features

### Homepage
- Animated hero section with glowing text
- Interactive app ecosystem showcase
- Embedded Beacons storefront
- About section with mission statement

### Navigation
- Fixed navigation bar with backdrop blur
- Anchor links for smooth scrolling
- Faith Mode toggle (non-functional)
- Mobile-responsive hamburger menu

### Footer
- Platform links (About, Blog, Press)
- App ecosystem links
- Support and legal links
- Scripture reference (Psalm 127:1)

## 🔧 Configuration

### Tailwind CSS
Custom configuration with Kingdom Collective theme colors and animations.

### Next.js
Optimized for performance with:
- Image optimization
- Automatic code splitting
- Static generation where possible
- Security headers

### Environment Variables
Template provided for all necessary API keys and configuration.

## 📞 Support

For questions or support:
- **Email**: support@kingdomcollective.pro
- **Website**: https://kingdomcollective.pro
- **Documentation**: [Link to docs]

---

**Built with ❤️ for Kingdom Collective**

*"Unless the Lord builds the house, the builders labor in vain." - Psalm 127:1* 