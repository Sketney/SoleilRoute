import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import {
  createNotification,
  getCommunityPostById,
  getUserById,
  hasUserLiked,
  listLikesByPost,
  listSavesByPost,
  toggleLike,
  toggleSave,
} from "@/server/db";

const reactionSchema = z.object({
  action: z.enum(["like", "save"]),
  enabled: z.boolean(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { postId } = await params;
  const post = await getCommunityPostById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (parsed.data.action === "like") {
    const alreadyLiked = await hasUserLiked(postId, session.user.id);
    await toggleLike(postId, session.user.id, parsed.data.enabled);
    if (
      parsed.data.enabled &&
      !alreadyLiked &&
      post.author_id !== session.user.id
    ) {
      const actor = await getUserById(session.user.id);
      const actorName =
        actor?.display_name?.trim() ||
        actor?.email?.split("@")[0] ||
        actor?.email ||
        "Someone";
      await createNotification(post.author_id, {
        title: "New like",
        message: `${actorName} liked your post.`,
        type: "info",
        action_url: "/dashboard/community",
      });
    }
  } else {
    await toggleSave(postId, session.user.id, parsed.data.enabled);
  }

  const likeCount = (await listLikesByPost(postId)).length;
  const saveCount = (await listSavesByPost(postId)).length;
  return NextResponse.json({
    like_count: likeCount,
    save_count: saveCount,
  });
}
