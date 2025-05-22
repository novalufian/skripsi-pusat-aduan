import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ESNext",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["src/**/*.ts"],
  "eslint": {
    "ignoreDuringBuilds": true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },

}

export default nextConfig;
