/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use default server output so API routes work
    // output: "export",
    trailingSlash: false,
    images: {
        unoptimized: true,
        domains: ['desitotrh.com'],
    },
}

module.exports = nextConfig