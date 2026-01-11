import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession, deleteSession, getSessionWithUser, getUserByEmail } from "@/server/db";
import { apiError } from "@/lib/api/responses";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

  const { email, password } = parsed.data;
  const user = getUserByEmail(email);

  if (!user) {
    return apiError("INVALID_CREDENTIALS", "Invalid credentials", 401);
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return apiError("INVALID_CREDENTIALS", "Invalid credentials", 401);
  }

  const cookieStore = await cookies();
  const existingToken = cookieStore.get("session_token")?.value;
  if (existingToken) {
    const session = getSessionWithUser(existingToken);
    if (session?.user_id === user.id) {
      return NextResponse.json({
        user: { id: user.id, email: user.email },
      });
    }
    deleteSession(existingToken);
  }

  const session = createSession(user.id);

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
