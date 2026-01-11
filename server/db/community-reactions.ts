import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type CommunityLikeRecord = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type CommunitySaveRecord = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export async function listLikesByPost(
  postId: string,
): Promise<CommunityLikeRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_likes
      .filter((entry) => entry.post_id === postId)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("community_likes")
    .select("*")
    .eq("post_id", postId);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as CommunityLikeRecord) }));
}

export async function listSavesByPost(
  postId: string,
): Promise<CommunitySaveRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_saves
      .filter((entry) => entry.post_id === postId)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("community_saves")
    .select("*")
    .eq("post_id", postId);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as CommunitySaveRecord) }));
}

export async function hasUserLiked(postId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_likes.some(
      (entry) => entry.post_id === postId && entry.user_id === userId,
    );
  }

  const { data, error } = await supabase
    .from("community_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  return !error && Boolean(data);
}

export async function hasUserSaved(postId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_saves.some(
      (entry) => entry.post_id === postId && entry.user_id === userId,
    );
  }

  const { data, error } = await supabase
    .from("community_saves")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  return !error && Boolean(data);
}

export async function toggleLike(
  postId: string,
  userId: string,
  enabled: boolean,
) {
  let liked = false;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const exists = db.community_likes.find(
        (entry) => entry.post_id === postId && entry.user_id === userId,
      );
      if (enabled && !exists) {
        db.community_likes.push({
          id: crypto.randomUUID(),
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
        liked = true;
        return;
      }
      if (!enabled && exists) {
        db.community_likes = db.community_likes.filter(
          (entry) => !(entry.post_id === postId && entry.user_id === userId),
        );
        liked = false;
        return;
      }
      liked = Boolean(exists);
    });
    return liked;
  }

  const { data: existing } = await supabase
    .from("community_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (enabled && !existing) {
    await supabase.from("community_likes").insert({
      id: crypto.randomUUID(),
      post_id: postId,
      user_id: userId,
      created_at: new Date().toISOString(),
    });
    liked = true;
  } else if (!enabled && existing) {
    await supabase
      .from("community_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    liked = false;
  } else {
    liked = Boolean(existing);
  }

  return liked;
}

export async function toggleSave(
  postId: string,
  userId: string,
  enabled: boolean,
) {
  let saved = false;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const exists = db.community_saves.find(
        (entry) => entry.post_id === postId && entry.user_id === userId,
      );
      if (enabled && !exists) {
        db.community_saves.push({
          id: crypto.randomUUID(),
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
        saved = true;
        return;
      }
      if (!enabled && exists) {
        db.community_saves = db.community_saves.filter(
          (entry) => !(entry.post_id === postId && entry.user_id === userId),
        );
        saved = false;
        return;
      }
      saved = Boolean(exists);
    });
    return saved;
  }

  const { data: existing } = await supabase
    .from("community_saves")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (enabled && !existing) {
    await supabase.from("community_saves").insert({
      id: crypto.randomUUID(),
      post_id: postId,
      user_id: userId,
      created_at: new Date().toISOString(),
    });
    saved = true;
  } else if (!enabled && existing) {
    await supabase
      .from("community_saves")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    saved = false;
  } else {
    saved = Boolean(existing);
  }

  return saved;
}

export async function listSavedPostIdsByUser(
  userId: string,
): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.community_saves
      .filter((entry) => entry.user_id === userId)
      .map((entry) => entry.post_id);
  }

  const { data, error } = await supabase
    .from("community_saves")
    .select("post_id")
    .eq("user_id", userId);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => entry.post_id as string);
}

export async function deleteReactionsByPost(postId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.community_likes = db.community_likes.filter(
        (entry) => entry.post_id !== postId,
      );
      db.community_saves = db.community_saves.filter(
        (entry) => entry.post_id !== postId,
      );
    });
    return;
  }

  await supabase.from("community_likes").delete().eq("post_id", postId);
  await supabase.from("community_saves").delete().eq("post_id", postId);
}
