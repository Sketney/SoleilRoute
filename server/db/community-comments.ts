import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type CommunityCommentRecord = {
  id: string;
  post_id: string;
  parent_id?: string | null;
  author_id: string;
  author_email: string;
  text: string;
  created_at: string;
};

export async function getCommunityCommentById(
  commentId: string,
): Promise<CommunityCommentRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const comment = db.community_comments.find(
      (entry) => entry.id === commentId,
    );
    return comment ? { ...comment } : null;
  }

  const { data, error } = await supabase
    .from("community_comments")
    .select("*")
    .eq("id", commentId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { ...(data as CommunityCommentRecord) };
}

export async function listCommentsByPost(
  postId: string,
  limit = 20,
): Promise<CommunityCommentRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_comments
      .filter((comment) => comment.post_id === postId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .slice(0, limit)
      .map((comment) => ({ ...comment }));
  }

  const { data, error } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((comment) => ({ ...(comment as CommunityCommentRecord) }));
}

export async function createCommunityComment(
  userId: string,
  authorEmail: string,
  postId: string,
  text: string,
  parentId?: string | null,
): Promise<CommunityCommentRecord> {
  const record: CommunityCommentRecord = {
    id: crypto.randomUUID(),
    post_id: postId,
    parent_id: parentId ?? undefined,
    author_id: userId,
    author_email: authorEmail,
    text,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    let created: CommunityCommentRecord | null = null;
    updateDatabase((db) => {
      db.community_comments.push(record);
      created = { ...record };
    });

    if (!created) {
      throw new Error("FAILED_TO_CREATE_COMMENT");
    }
    return created;
  }

  const { data, error } = await supabase
    .from("community_comments")
    .insert(record)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_CREATE_COMMENT");
  }
  return { ...(data as CommunityCommentRecord) };
}

export async function deleteCommentsByPost(postId: string) {
  let removed = 0;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const before = db.community_comments.length;
      db.community_comments = db.community_comments.filter(
        (comment) => comment.post_id !== postId,
      );
      removed = before - db.community_comments.length;
    });
    return removed;
  }

  const { data } = await supabase
    .from("community_comments")
    .select("id")
    .eq("post_id", postId);
  removed = data?.length ?? 0;
  await supabase.from("community_comments").delete().eq("post_id", postId);
  return removed;
}
