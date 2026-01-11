import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  createCommunityComment,
  createNotification,
  getCommunityCommentById,
  getCommunityPostById,
  getUserById,
  listCommentsByPost,
} from "@/server/db";
import { validateCommentText } from "@/lib/moderation/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const post = getCommunityPostById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 10;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 50)
    : 10;

  const comments = listCommentsByPost(postId, limit);
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const post = getCommunityPostById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const textValue = typeof body?.text === "string" ? body.text : "";
  const parentId = typeof body?.parentId === "string" ? body.parentId : null;

  const textCheck = validateCommentText(textValue);
  if (!textCheck.ok) {
    const status = textCheck.error === "COMMENT_PROHIBITED" ? 422 : 400;
    return NextResponse.json({ error: textCheck.error }, { status });
  }

  if (parentId) {
    const parent = getCommunityCommentById(parentId);
    if (!parent || parent.post_id !== postId) {
      return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
    }
  }

  const commentText = textCheck.value ?? textValue.trim();
  const comment = createCommunityComment(
    session.user.id,
    user.email,
    postId,
    commentText,
    parentId,
  );

  if (post.author_id !== session.user.id) {
    const actorName =
      user.display_name?.trim() || user.email.split("@")[0] || user.email;
    createNotification(post.author_id, {
      title: "New comment",
      message: `${actorName} commented on your post.`,
      type: "info",
      action_url: "/dashboard/community",
    });
  }

  return NextResponse.json({ comment });
}
