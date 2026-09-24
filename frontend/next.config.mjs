/** @type {import('next').NextConfig} */

// Static export: Hostinger shared hosting serves plain files (LiteSpeed + PHP),
// there is no Node runtime. Lead intake is handled by public/api/lead.php.
// Security headers live in public/.htaccess because export ignores headers().
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
