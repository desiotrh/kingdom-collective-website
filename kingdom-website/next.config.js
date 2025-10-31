/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use default server output so API routes work
    // output: "export",
    trailingSlash: false,
    images: {
        unoptimized: false, // ENABLED - Kingdom Manifesto Performance Standard
        domains: ['desitotrh.com', 'kingdomcollective.pro'],
        formats: ['image/avif', 'image/webp'], // Modern image formats
    },
    webpack: (config, { isServer }) => {
        // Fix for Windows EISDIR error with symlinks
        config.resolve.symlinks = false;
        return config;
    },
    // Kingdom Manifesto Security Headers - Proverbs 27:12: Security is stewardship
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: https: blob:",
                            "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
                            "connect-src 'self' https://api.stripe.com https://*.supabase.co https://api.openai.com",
                            "media-src 'self' blob: data:",
                        ].join('; ')
                    }
                ]
            }
        ]
    }
}

module.exports = nextConfig