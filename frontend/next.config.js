/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone"
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: `${process.env.API_URL}/api/v1/:path*`,
  //     }
  //   ]
  // },
};

module.exports = nextConfig;

