import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional(),
  EXCHANGE_RATE_BASE_CURRENCY: z
    .string()
    .length(3)
    .transform((value) => value.toUpperCase()),
});

const serverEnvSchema = z.object({
  EXCHANGE_RATE_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  SUPPORT_EMAIL: z.string().email().optional(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default("development"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  EXCHANGE_RATE_BASE_CURRENCY:
    process.env.EXCHANGE_RATE_BASE_CURRENCY ?? "USD",
});

const isServer = typeof window === "undefined";

const serverEnv = isServer
  ? serverEnvSchema.parse({
      EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
      SENTRY_DSN: process.env.SENTRY_DSN,
      SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    })
  : ({} as z.infer<typeof serverEnvSchema>);

export const env = {
  ...clientEnv,
  ...(isServer ? serverEnv : {}),
};

export const publicEnv = clientEnv;

export type ClientEnv = typeof clientEnv;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
