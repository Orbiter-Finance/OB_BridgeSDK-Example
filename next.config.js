/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enables the styled-components SWC transform
  // Fixed: Prop className did not match
  compiler: {
    styledComponents: true,
  },
  // swcMinify: true,
  // images: {
  //   unoptimized: true,
  // },
  // Fixed: @walletconnect error and warn
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      lokijs: false,
      encoding: false,
      'pino-pretty': false,
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
}

module.exports = nextConfig
