import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession, createUser, getUserByEmail } from "@/server/db";
import { apiError } from "@/lib/api/responses";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

  const { email, password } = parsed.data;

  if (getUserByEmail(email)) {
    return apiError("USER_EXISTS", "User already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;

  try {
    user = createUser(email, passwordHash);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
      return apiError("USER_EXISTS", "User already exists", 409);
    }
    throw error;
  }

  const session = createSession(user.id);
  const cookieStore = await cookies();

  cookieStore.set("session_token", session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    },
  });
}
