/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: "out",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: "",
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  basePath: "",
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig
