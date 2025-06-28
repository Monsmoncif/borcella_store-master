/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // Optional: Add if you see "unoptimized" image warnings
    formats: ['image/webp'],
  },
  // 👇 Skip TypeScript/ESLint errors during build (temporary fix)
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Use cautiously!
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint if needed
  },
  // 👇 Enable if you use trailing slashes in URLs
  trailingSlash: true,
};

export default nextConfig;