import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
}) as (config: NextConfig) => NextConfig;

const nextConfig: NextConfig = {
};

export default withPWAConfig(nextConfig);