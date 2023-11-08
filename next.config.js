/** @type {import('next').NextConfig} */

const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_AMAZON_BUCKET_URL,
      }
    ]
  },
  sassOptions: {
    fiber: false,
    includePaths: [
      path.join(__dirname, 'src/styles'),
    ],
    prependData: `
      @import "~@/styles/vars.scss";
      @import '~bootstrap/scss/_functions.scss';
      @import '~bootstrap/scss/_mixins.scss';
      @import '~bootstrap/scss/_variables.scss';
    `,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
