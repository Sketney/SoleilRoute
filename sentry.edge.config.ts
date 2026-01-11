import { init } from "@sentry/nextjs";
import { env } from "@/lib/env";

if (env.SENTRY_DSN ?? env.NEXT_PUBLIC_SENTRY_DSN) {
  init({
    dsn: env.SENTRY_DSN ?? env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: env.SENTRY_ENVIRONMENT,
  });
}
