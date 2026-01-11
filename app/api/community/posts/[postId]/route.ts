import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import {
  createNotification,
  deleteCommunityPost,
  getCommunityPostById,
  getUserById,
  hasUserLiked,
  hasUserSaved,
  listLikesByPost,
  listSavesByPost,
  updateCommunityPost,
} from "@/server/db";
import {
  validateMapUrl,
  validatePostText,
  validateTag,
} from "@/lib/moderation/validation";

const updateSchema = z.object({
  tag: z.string().optional(),
  text: z.string().optional(),
  mapUrl: z.union([z.string(), z.null()]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserById(session.user.id);
  if (!isModerator(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { postId } = await params;
  const post = getCommunityPostById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const updates: {
    tag?: Parameters<typeof updateCommunityPost>[1]["tag"];
    text?: string;
    map_url?: string | null;
  } = {};

  if (parsed.data.tag !== undefined) {
    const tagCheck = validateTag(parsed.data.tag);
    if (!tagCheck.ok) {
      return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
    }
    updates.tag = tagCheck.value;
  }

  if (parsed.data.text !== undefined) {
    const textCheck = validatePostText(parsed.data.text);
    if (!textCheck.ok) {
      const status = textCheck.error === "TEXT_PROHIBITED" ? 422 : 400;
      return NextResponse.json({ error: textCheck.error }, { status });
    }
    updates.text = textCheck.value;
  }

  if (parsed.data.mapUrl !== undefined) {
    const mapCheck = validateMapUrl(parsed.data.mapUrl ?? "");
    if (!mapCheck.ok) {
      return NextResponse.json({ error: mapCheck.error }, { status: 400 });
    }
    updates.map_url = mapCheck.value ? mapCheck.value : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const updated = updateCommunityPost(postId, updates);
  const author = getUserById(updated.author_id);
  const fallbackName =
    author?.email?.split("@")[0] ||
    updated.author_email?.split("@")[0] ||
    updated.author_email;
  const likeCount = listLikesByPost(postId).length;
  const saveCount = listSavesByPost(postId).length;
  return NextResponse.json({
    post: {
      ...updated,
      author_name: author?.display_name?.trim() || fallbackName,
      author_avatar_url: author?.avatar_url ?? "",
      like_count: likeCount,
      save_count: saveCount,
      liked_by_me: hasUserLiked(postId, session.user.id),
      saved_by_me: hasUserSaved(postId, session.user.id),
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserById(session.user.id);
  if (!isModerator(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { postId } = await params;
  const removed = deleteCommunityPost(postId);

  createNotification(removed.author_id, {
    title: "Post removed",
    message: "Your community post was removed by a moderator.",
    type: "warning",
    action_url: "/dashboard/community",
  });

  return NextResponse.json({ post: removed });
}
