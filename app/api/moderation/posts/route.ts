import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { listPendingPosts, getUserById } from "@/server/db";
import { isModerator } from "@/lib/auth/roles";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserById(session.user.id);
  if (!isModerator(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const posts = listPendingPosts(200);
  return NextResponse.json({ posts });
}
