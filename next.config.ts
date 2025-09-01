import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 忽略 TypeScript 编译错误
    ignoreBuildErrors: true
  },
  eslint: {
    // 忽略 ESLint 错误
    ignoreDuringBuilds: true
  }
}

export default nextConfig
