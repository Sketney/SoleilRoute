import crypto from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";
import { createSession, createUser, getUserByEmail } from "@/server/db";

export const runtime = "nodejs";

type GoogleTokenResponse = {
  id_token?: string;
  access_token?: string;
  error?: string;
};

type GoogleIdTokenPayload = {
  email?: string;
  email_verified?: boolean;
};

function decodeJwtPayload(token: string): GoogleIdTokenPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json) as GoogleIdTokenPayload;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
  }

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
  }

  const redirectUri = new URL(
    "/auth/google/callback",
    env.NEXT_PUBLIC_APP_URL,
  ).toString();

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
  }

  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
  if (!tokenData.id_token) {
    return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
  }

  const payload = decodeJwtPayload(tokenData.id_token);
  const email = payload?.email;
  const emailVerified = payload?.email_verified ?? false;
  if (!email || !emailVerified) {
    return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
  }

  let user = getUserByEmail(email);
  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, 12);
    user = createUser(email, passwordHash);
  }

  const session = createSession(user.id);
  cookieStore.set("session_token", session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.redirect(new URL("/dashboard", env.NEXT_PUBLIC_APP_URL));
}
