import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel serverless function settings
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium"],

  images: {
    remotePatterns: [
      {
        // Supabase Storage for screenshots
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
