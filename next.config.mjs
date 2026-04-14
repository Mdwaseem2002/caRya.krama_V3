/** @type {import('next').NextConfig} */
const nextConfig = {

  // ─── Image Optimization ───────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],           // Prefer AVIF > WebP > original
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],  // Match real breakpoints used in app
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,             // Cache optimised images 30 days
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },

  // ─── Experimental: parallel compilation + package import optimisation ─────
  // optimizePackageImports performs automatic tree-shaking / barrel-file
  // flattening so you don't get 5 000 lucide SVGs in your bundle anymore.
  experimental: {
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    optimizePackageImports: [
      "lucide-react",     // Your most-used import (dozens of components use it)
      "framer-motion",    // Heavy barrel file – this is a huge win
      "gsap",             // Prevents pulling in plugins you haven't registered
    ],
  },

  // ─── Webpack tweaks ───────────────────────────────────────────────────────
  // This entire block is skipped when `next dev --turbo` is active to prevent
  // the "webpack configured while Turbopack is not" warning.
  // It still applies to `next build` (which always uses webpack in Next 14).
  ...(process.env.TURBOPACK
    ? {}
    : {
        webpack: (config, { dev, isServer }) => {
          // Use cheap-module-source-map in dev – ~3× faster rebuild than
          // the default 'eval-source-map' while still giving line-number info.
          if (dev && !isServer) {
            config.devtool = "cheap-module-source-map";
          }

          // Prevent server-only Node built-ins from leaking into client bundle.
          // (Useful because mongoose / bcryptjs are used in API routes)
          if (!isServer) {
            config.resolve.fallback = {
              ...config.resolve.fallback,
              fs: false,
              net: false,
              tls: false,
              crypto: false,
            };
          }

          return config;
        },
      }),
};

export default nextConfig;
