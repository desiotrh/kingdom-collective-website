/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['desitotrh.com'],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self' https://desitotrh.com https://beacons.ai; frame-src 'self' https://desitotrh.com https://beacons.ai;",
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