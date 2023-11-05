/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_AMAZON_BUCKET_URL,
      }
    ]
  }
}

module.exports = nextConfig
