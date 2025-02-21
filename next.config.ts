/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://13xv9sjf-8000.use2.devtunnels.ms/:path*',
      },
    ];
  },
}

module.exports = nextConfig;