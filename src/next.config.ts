import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  devIndicators: false,
};

export default nextConfig;
