/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm)$/i,
      type: 'asset/resource'
    });
    return config;
  }
};

export default nextConfig;
