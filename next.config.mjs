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
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(aff|dic)$/i,
      use: 'raw-loader',
    })

    return config
  },
};

export default nextConfig;
