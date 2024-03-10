/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { serverActions: true },
    devIndicators: {
        buildActivity: false,
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'uxwing.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'static.vecteezy.com',
                port: '',
            },
        ],
    },
}
export default nextConfig
