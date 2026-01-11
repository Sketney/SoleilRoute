import crypto from "crypto";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getUserById,
  createCommunityPost,
  listApprovedPosts,
  listPostsByAuthor,
  listPostsByIds,
  listSavedPostIdsByUser,
  listLikesByPost,
  listSavesByPost,
  hasUserLiked,
  hasUserSaved,
} from "@/server/db";
import {
  savePostImage,
  validateMapUrl,
  validatePostText,
  validateTag,
} from "@/lib/moderation/validation";
import type { CommunityPost } from "@/types/community";

export const runtime = "nodejs";

const maxImageBytes = 10 * 1024 * 1024;

async function enrichPosts(posts: CommunityPost[], viewerId: string) {
  return Promise.all(
    posts.map(async (post) => {
      const author = await getUserById(post.author_id);
      const fallbackName =
        author?.email?.split("@")[0] ||
        post.author_email?.split("@")[0] ||
        post.author_email;
      const likeCount = (await listLikesByPost(post.id)).length;
      const saveCount = (await listSavesByPost(post.id)).length;
      return {
        ...post,
        author_name: author?.display_name?.trim() || fallbackName,
        author_avatar_url: author?.avatar_url ?? "",
        like_count: likeCount,
        save_count: saveCount,
        liked_by_me: await hasUserLiked(post.id, viewerId),
        saved_by_me: await hasUserSaved(post.id, viewerId),
      };
    }),
  );
}

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") ?? "feed";
  const limitParam = url.searchParams.get("limit");
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 50;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 200)
    : 50;

  if (scope === "mine") {
    const posts = await listPostsByAuthor(session.user.id, limit);
    return NextResponse.json({
      posts: await enrichPosts(posts, session.user.id),
    });
  }

  if (scope === "saved") {
    const savedIds = await listSavedPostIdsByUser(session.user.id);
    const posts = (await listPostsByIds(savedIds))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);
    return NextResponse.json({
      posts: await enrichPosts(posts, session.user.id),
    });
  }

  const posts = await listApprovedPosts(limit);
  return NextResponse.json({
    posts: await enrichPosts(posts, session.user.id),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const tagValue = String(formData.get("tag") ?? "");
  const textValue = String(formData.get("text") ?? "");
  const mapUrlValue = String(formData.get("mapUrl") ?? "");
  const imageValue = formData.get("image");

  const tagCheck = validateTag(tagValue);
  if (!tagCheck.ok) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }

  const textCheck = validatePostText(textValue);
  if (!textCheck.ok) {
    const status = textCheck.error === "TEXT_PROHIBITED" ? 422 : 400;
    return NextResponse.json({ error: textCheck.error }, { status });
  }

  const mapCheck = validateMapUrl(mapUrlValue);
  if (!mapCheck.ok) {
    return NextResponse.json({ error: mapCheck.error }, { status: 400 });
  }

  const hasFile = imageValue instanceof File && imageValue.size > 0;
  const hasMap = Boolean(mapCheck.value);
  if (!hasFile && !hasMap) {
    return NextResponse.json(
      { error: "Image or map link is required" },
      { status: 400 },
    );
  }

  let imageUrl: string | undefined;
  if (hasFile && imageValue instanceof File) {
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "community",
    );
    const fileKey = crypto.randomUUID();
    const saved = await savePostImage(
      imageValue,
      uploadsDir,
      fileKey,
      maxImageBytes,
    );
    if (!saved.ok) {
      return NextResponse.json({ error: saved.error }, { status: 400 });
    }
    imageUrl = saved.url;
  }

  const safeTag = tagCheck.value ?? "other";
  const safeText = textCheck.value ?? textValue.trim();
  const safeMapUrl = hasMap ? (mapCheck.value ?? "") : undefined;
  const post = await createCommunityPost(session.user.id, user.email, {
    tag: safeTag,
    text: safeText,
    image_url: imageUrl,
    map_url: safeMapUrl,
  });

  const fallbackName =
    user.display_name?.trim() ||
    user.email.split("@")[0] ||
    user.email;
  const enriched: CommunityPost = {
    ...post,
    author_name: fallbackName,
    author_avatar_url: user.avatar_url ?? "",
    like_count: 0,
    save_count: 0,
    liked_by_me: false,
    saved_by_me: false,
  };

  return NextResponse.json({ post: enriched });
}
