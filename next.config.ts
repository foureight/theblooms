import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https://images.unsplash.com https://*.packeta.com https://widget.packeta.com",
              "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net",
              "font-src 'self' data: https://use.typekit.net https://p.typekit.net https://*.typekit.net",
              // Packeta widget library + iframe map
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.packeta.com https://backup.widget.packeta.com https://hd.widget.packeta.com",
              "connect-src 'self' https://use.typekit.net https://p.typekit.net https://*.typekit.net https://widget.packeta.com https://backup.widget.packeta.com https://hd.widget.packeta.com https://*.packeta.com",
              "frame-src https://widget.packeta.com https://backup.widget.packeta.com https://hd.widget.packeta.com https://*.packeta.com",
              "child-src https://widget.packeta.com https://backup.widget.packeta.com https://hd.widget.packeta.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
