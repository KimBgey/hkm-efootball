/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // firebase-admin pulls in jwks-rsa -> jose (ESM-only in recent versions).
  // Bundling it with webpack breaks require() at runtime on Vercel; keeping it
  // external lets Node's own module resolution handle the dual package correctly.
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
};

export default nextConfig;
