/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.themealdb.com'], // ✅ allow external images from TheMealDB
  },
}

module.exports = nextConfig
