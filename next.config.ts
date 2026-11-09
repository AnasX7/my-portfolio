import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    typedEnv: true,
  },
  redirects() {
    return [
      { source: '/', destination: '/en', permanent: true },
      { source: '/privacy', destination: '/en/privacy', permanent: true },
      { source: '/projects', destination: '/en/projects', permanent: true },
      { source: '/projects/:slug', destination: '/en/projects/:slug', permanent: true },
    ]
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
