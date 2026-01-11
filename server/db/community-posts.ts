import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { CommunityTag } from "@/lib/moderation/tags";

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

export function createCommunityPost(
  userId: string,
  authorEmail: string,
  data: {
    tag: CommunityTag;
    text: string;
    image_url?: string;
    map_url?: string;
  },
): CommunityPostRecord {
  let created: CommunityPostRecord | null = null;

  updateDatabase((db) => {
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
    db.community_posts.push(record);
    created = { ...record };
  });

  if (!created) {
    throw new Error("FAILED_TO_CREATE_POST");
  }
  return created;
}

export function listApprovedPosts(limit = 50): CommunityPostRecord[] {
  const db = readDatabase();
  return db.community_posts
    .filter((post) => post.status === "approved")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((post) => ({ ...post }));
}

export function listPendingPosts(limit = 200): CommunityPostRecord[] {
  const db = readDatabase();
  return db.community_posts
    .filter((post) => post.status === "pending")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((post) => ({ ...post }));
}

export function listPostsByAuthor(
  userId: string,
  limit = 200,
): CommunityPostRecord[] {
  const db = readDatabase();
  return db.community_posts
    .filter((post) => post.author_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((post) => ({ ...post }));
}

export function getCommunityPostById(postId: string): CommunityPostRecord | null {
  const db = readDatabase();
  const post = db.community_posts.find((entry) => entry.id === postId);
  return post ? { ...post } : null;
}

export function listPostsByIds(postIds: string[]): CommunityPostRecord[] {
  if (!postIds.length) {
    return [];
  }
  const lookup = new Set(postIds);
  const db = readDatabase();
  return db.community_posts
    .filter((post) => lookup.has(post.id))
    .map((post) => ({ ...post }));
}

export function updateCommunityPostStatus(
  postId: string,
  status: CommunityPostStatus,
  moderatorId: string,
  reason?: string,
): CommunityPostRecord {
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

export function updateCommunityPost(
  postId: string,
  updates: {
    tag?: CommunityTag;
    text?: string;
    map_url?: string | null;
    image_url?: string | null;
  },
): CommunityPostRecord {
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

export function deleteCommunityPost(postId: string): CommunityPostRecord {
  let removed: CommunityPostRecord | null = null;

  updateDatabase((db) => {
    const target = db.community_posts.find((post) => post.id === postId);
    if (!target) {
      throw new Error("POST_NOT_FOUND");
    }
    removed = { ...target };
    db.community_posts = db.community_posts.filter((post) => post.id !== postId);
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
