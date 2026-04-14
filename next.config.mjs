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

  // ─── Faster Builds: Skip linting and type checking during next build ───────
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  },

  // ─── Experimental: package import optimisation ───────────────────────────
  // optimizePackageImports flattens barrel files so only the icons/functions
  // you actually import are included in the bundle.
  // NOTE: parallelServerCompiles + parallelServerBuildTraces were removed —
  // they require Node.js build workers unavailable on Vercel.
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "gsap",
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
