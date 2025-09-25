/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use default server output so API routes work
    // output: "export",
    trailingSlash: false,
    images: {
        unoptimized: true,
        domains: ['desitotrh.com'],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' https://js.stripe.com",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: https: blob:",
                            "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
                            "connect-src 'self' https://api.stripe.com https://js.stripe.com"
                        ].join('; '),
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig 