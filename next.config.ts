import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Set the base path for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/foomatic-lookup-site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/foomatic-lookup-site' : '',
};

export default nextConfig;
