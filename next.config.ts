import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Standard device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // ImageKit handles WebP/AVIF conversion via tr=f-webp URL params.
    // Next.js still does client-side format negotiation for fallback.
    formats: ['image/webp'],
    remotePatterns: [
      // ✅ ImageKit CDN — primary image delivery domain
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**"
      },
      // UploadThing (new CDN domain) — primary for new uploads
      {
        protocol: "https",
        hostname: "ufs.sh",
        pathname: "/**"
      },
      // UploadThing (legacy domain) — kept for existing stored image URLs
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "jndnpgjbolhkgpgyjzto.supabase.co",
        pathname: "/storage/v1/object/public/**"
      },
      {
        protocol: "https",
        hostname: "qwmnhuqeyqmryzigvaup.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  }
};

export default nextConfig;
