import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typedRoutes: true,
  productionBrowserSourceMaps: true,
  allowedDevOrigins: [
    "http://127.0.0.1:3001",
    "http://localhost:3001",
  ],
  webpack: (config, { dev }) => {
    if (dev) {
      const ignored = config.watchOptions?.ignored ?? [];
      const ignoreList = Array.isArray(ignored) ? ignored : [ignored];
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: [
          ...ignoreList,
          "**/server/data/**",
          "**/dev-server-error.log",
          "**/*.log",
        ],
      };
    }
    return config;
  },
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
);
