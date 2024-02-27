/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.pisentry.app',
            },
            { hostname: 'localhost' },
            { hostname: '127.0.0.1' },
            { hostname: '192.168.1.211' },
        ],
    },
}

export default nextConfig;
