/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thecocktaildb.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
