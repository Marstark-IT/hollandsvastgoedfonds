/** @type {import('next').NextConfig} */

// Static export: Hostinger shared hosting serves plain files (LiteSpeed + PHP),
// there is no Node runtime. Lead intake and analytics are PHP in public/api.
// Security headers live in public/.htaccess because export ignores headers().
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.js",
    deviceSizes: [480, 828, 1200, 1920, 2560],
    imageSizes: [320],
  },
};

export default nextConfig;
