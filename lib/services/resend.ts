import { Resend } from "resend";
import { env } from "@/lib/env";

const resendClient = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface SendTripEmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface SendSupportEmailOptions {
  fromEmail: string;
  subject: string;
  message: string;
  userId?: string;
  accountEmail?: string;
}

export async function sendTripSummaryEmail(options: SendTripEmailOptions) {
  if (!resendClient || !env.RESEND_FROM_EMAIL) {
    console.warn("Resend is not configured. Skipping email dispatch.");
    return { skipped: true };
  }

  await resendClient.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  return { skipped: false };
}

export async function sendSupportEmail(options: SendSupportEmailOptions) {
  if (!resendClient || !env.RESEND_FROM_EMAIL || !env.SUPPORT_EMAIL) {
    console.warn("Support email is not configured. Skipping email dispatch.");
    return { skipped: true };
  }

  const text = [
    `From: ${options.fromEmail}`,
    options.accountEmail ? `Account email: ${options.accountEmail}` : null,
    options.userId ? `User ID: ${options.userId}` : null,
    "",
    options.message,
  ]
    .filter(Boolean)
    .join("\n");

  await resendClient.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: env.SUPPORT_EMAIL,
    subject: `Support: ${options.subject}`,
    text,
    replyTo: options.fromEmail,
  });

  return { skipped: false };
}

