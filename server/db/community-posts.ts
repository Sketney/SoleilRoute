import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { CommunityTag } from "@/lib/moderation/tags";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type CommunityPostStatus = "pending" | "approved" | "rejected";

export type CommunityPostRecord = {
  id: string;
  author_id: string;
  author_email: string;
  tag: CommunityTag;
  text: string;
  image_url?: string;
  map_url?: string;
  created_at: string;
  status: CommunityPostStatus;
  moderated_by?: string;
  moderated_at?: string;
  rejection_reason?: string;
};

export async function createCommunityPost(
  userId: string,
  authorEmail: string,
  data: {
    tag: CommunityTag;
    text: string;
    image_url?: string;
    map_url?: string;
  },
): Promise<CommunityPostRecord> {
  const record: CommunityPostRecord = {
    id: crypto.randomUUID(),
    author_id: userId,
    author_email: authorEmail,
    tag: data.tag,
    text: data.text,
    image_url: data.image_url,
    map_url: data.map_url,
    created_at: new Date().toISOString(),
    status: "pending",
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    let created: CommunityPostRecord | null = null;
    updateDatabase((db) => {
      db.community_posts.push(record);
      created = { ...record };
    });

    if (!created) {
      throw new Error("FAILED_TO_CREATE_POST");
    }
    return created;
  }

  const { data: inserted, error } = await supabase
    .from("community_posts")
    .insert(record)
    .select("*")
    .single();
  if (error || !inserted) {
    throw new Error("FAILED_TO_CREATE_POST");
  }
  return { ...(inserted as CommunityPostRecord) };
}

export async function listApprovedPosts(
  limit = 50,
): Promise<CommunityPostRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_posts
      .filter((post) => post.status === "approved")
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map((post) => ({ ...post }));
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((post) => ({ ...(post as CommunityPostRecord) }));
}

export async function listPendingPosts(
  limit = 200,
): Promise<CommunityPostRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_posts
      .filter((post) => post.status === "pending")
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map((post) => ({ ...post }));
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((post) => ({ ...(post as CommunityPostRecord) }));
}

export async function listPostsByAuthor(
  userId: string,
  limit = 200,
): Promise<CommunityPostRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_posts
      .filter((post) => post.author_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map((post) => ({ ...post }));
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((post) => ({ ...(post as CommunityPostRecord) }));
}

export async function getCommunityPostById(
  postId: string,
): Promise<CommunityPostRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const post = db.community_posts.find((entry) => entry.id === postId);
    return post ? { ...post } : null;
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { ...(data as CommunityPostRecord) };
}

export async function listPostsByIds(
  postIds: string[],
): Promise<CommunityPostRecord[]> {
  if (!postIds.length) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const lookup = new Set(postIds);
    const db = readDatabase();
    return db.community_posts
      .filter((post) => lookup.has(post.id))
      .map((post) => ({ ...post }));
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .in("id", postIds);
  if (error || !data) {
    return [];
  }
  return data.map((post) => ({ ...(post as CommunityPostRecord) }));
}

export async function updateCommunityPostStatus(
  postId: string,
  status: CommunityPostStatus,
  moderatorId: string,
  reason?: string,
): Promise<CommunityPostRecord> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    let updated: CommunityPostRecord | null = null;
    updateDatabase((db) => {
      const target = db.community_posts.find((post) => post.id === postId);
      if (!target) {
        throw new Error("POST_NOT_FOUND");
      }

      target.status = status;
      target.moderated_by = moderatorId;
      target.moderated_at = new Date().toISOString();
      target.rejection_reason = reason;
      updated = { ...target };
    });

    if (!updated) {
      throw new Error("FAILED_TO_UPDATE_POST");
    }

    return updated;
  }

  const { data, error } = await supabase
    .from("community_posts")
    .update({
      status,
      moderated_by: moderatorId,
      moderated_at: new Date().toISOString(),
      rejection_reason: reason ?? null,
    })
    .eq("id", postId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_UPDATE_POST");
  }
  return { ...(data as CommunityPostRecord) };
}

export async function updateCommunityPost(
  postId: string,
  updates: {
    tag?: CommunityTag;
    text?: string;
    map_url?: string | null;
    image_url?: string | null;
  },
): Promise<CommunityPostRecord> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    let updated: CommunityPostRecord | null = null;
    updateDatabase((db) => {
      const target = db.community_posts.find((post) => post.id === postId);
      if (!target) {
        throw new Error("POST_NOT_FOUND");
      }

      if (updates.tag !== undefined) {
        target.tag = updates.tag;
      }
      if (updates.text !== undefined) {
        target.text = updates.text;
      }
      if (updates.map_url !== undefined) {
        target.map_url = updates.map_url ?? undefined;
      }
      if (updates.image_url !== undefined) {
        target.image_url = updates.image_url ?? undefined;
      }

      updated = { ...target };
    });

    if (!updated) {
      throw new Error("FAILED_TO_UPDATE_POST");
    }
    return updated;
  }

  const payload: Record<string, string | null> = {};
  if (updates.tag !== undefined) {
    payload.tag = updates.tag;
  }
  if (updates.text !== undefined) {
    payload.text = updates.text;
  }
  if (updates.map_url !== undefined) {
    payload.map_url = updates.map_url;
  }
  if (updates.image_url !== undefined) {
    payload.image_url = updates.image_url;
  }

  const { data, error } = await supabase
    .from("community_posts")
    .update(payload)
    .eq("id", postId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_UPDATE_POST");
  }
  return { ...(data as CommunityPostRecord) };
}

export async function deleteCommunityPost(
  postId: string,
): Promise<CommunityPostRecord> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    let removed: CommunityPostRecord | null = null;
    updateDatabase((db) => {
      const target = db.community_posts.find((post) => post.id === postId);
      if (!target) {
        throw new Error("POST_NOT_FOUND");
      }
      removed = { ...target };
      db.community_posts = db.community_posts.filter(
        (post) => post.id !== postId,
      );
      db.community_comments = db.community_comments.filter(
        (comment) => comment.post_id !== postId,
      );
      db.community_likes = db.community_likes.filter(
        (entry) => entry.post_id !== postId,
      );
      db.community_saves = db.community_saves.filter(
        (entry) => entry.post_id !== postId,
      );
    });

    if (!removed) {
      throw new Error("FAILED_TO_DELETE_POST");
    }
    return removed;
  }

  const { data, error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .select("*")
    .maybeSingle();
  if (error || !data) {
    throw new Error("FAILED_TO_DELETE_POST");
  }

  await supabase.from("community_comments").delete().eq("post_id", postId);
  await supabase.from("community_likes").delete().eq("post_id", postId);
  await supabase.from("community_saves").delete().eq("post_id", postId);

  return { ...(data as CommunityPostRecord) };
}
