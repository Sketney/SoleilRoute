import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "@/lib/auth/session";
import { deleteSessionsByUser } from "@/server/db";

export async function DELETE() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const currentToken = cookieStore.get("session_token")?.value;
  const revoked = await deleteSessionsByUser(session.user.id, currentToken);

  return NextResponse.json({ revoked });
}
