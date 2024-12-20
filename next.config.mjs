/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uqmtnbebjduxlghdonnv.supabase.co**',
        pathname: '/storage/v1/object/public/**',
        port: '',
      },
    ],
  },
};

export default nextConfig;
