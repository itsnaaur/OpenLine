import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. 'unsafe-inline' is needed for Next.js inline scripts
// and Tailwind; 'unsafe-eval' is only needed by the dev server.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://firebasestorage.googleapis.com${isDev ? " http://127.0.0.1:9199" : ""}`,
  "font-src 'self' data:",
  // In development, also allow the dev server websocket and local Firebase emulators
  `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com${isDev ? " http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*" : ""}`,
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up lockfiles in parent folders
  turbopack: {
    root: process.cwd(),
  },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;
