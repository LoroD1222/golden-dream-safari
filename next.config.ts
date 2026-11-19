import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {useTypeScriptCli: false},
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/iir1avhf/production/**",
      },
    ],
  },
  async redirects() {
    return [
      {source: "/kilimanjaro-packages", destination: "/kilimanjaro", permanent: true},
      {source: "/kilimanjaro-packages/:slug", destination: "/trips/:slug", permanent: true},
    ];
  },
};

export default nextConfig;
