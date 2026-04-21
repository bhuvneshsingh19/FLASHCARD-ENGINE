/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Move the setting that next.js suggested (it's no longer experimental)
  serverExternalPackages: ['pdf-parse'],

  // We are removing 'experimental.turbopack' and 'serverRuntimeConfig' completely.
};

export default nextConfig;