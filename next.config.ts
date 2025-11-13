import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tokens.1inch.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "token.1inch.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
