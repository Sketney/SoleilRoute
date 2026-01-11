import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/server/db";
import { publicEnv } from "@/lib/env";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    deleteSession(token);
    cookieStore.delete("session_token");
  }

  const redirectUrl = new URL("/login", publicEnv.NEXT_PUBLIC_APP_URL);
  if (request.headers.get("referer")) {
    redirectUrl.searchParams.set("from", "dashboard");
  }

  return NextResponse.redirect(redirectUrl);
}
