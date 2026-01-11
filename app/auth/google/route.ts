import crypto from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  if (!env.GOOGLE_CLIENT_ID) {
    return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = new URL(
    "/auth/google/callback",
    env.NEXT_PUBLIC_APP_URL,
  ).toString();

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "consent",
    access_type: "offline",
  });

  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
