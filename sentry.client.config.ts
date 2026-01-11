import { init } from "@sentry/nextjs";
import { publicEnv } from "@/lib/env";

if (publicEnv.NEXT_PUBLIC_SENTRY_DSN) {
  init({
    dsn: publicEnv.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
