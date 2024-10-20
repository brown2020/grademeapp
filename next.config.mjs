/** @type {import('next').NextConfig} */
const nextConfig = { 
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
                search: '',
            }            
        ],
    }
 };

export default nextConfig;
