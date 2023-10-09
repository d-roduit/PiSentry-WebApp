/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                // protocol: 'http',
                hostname: '127.0.0.1',
                // port: '',
                // pathname: '/*',
            },
            {
                hostname: '192.168.1.211',
            }
        ],
    },
}

export default nextConfig;
