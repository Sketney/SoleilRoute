import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";

export type CommunityCommentRecord = {
  id: string;
  post_id: string;
  parent_id?: string | null;
  author_id: string;
  author_email: string;
  text: string;
  created_at: string;
};

export function getCommunityCommentById(
  commentId: string,
): CommunityCommentRecord | null {
  const db = readDatabase();
  const comment = db.community_comments.find((entry) => entry.id === commentId);
  return comment ? { ...comment } : null;
}

export function listCommentsByPost(
  postId: string,
  limit = 20,
): CommunityCommentRecord[] {
  const db = readDatabase();
  return db.community_comments
    .filter((comment) => comment.post_id === postId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(0, limit)
    .map((comment) => ({ ...comment }));
}

export function createCommunityComment(
  userId: string,
  authorEmail: string,
  postId: string,
  text: string,
  parentId?: string | null,
): CommunityCommentRecord {
  let created: CommunityCommentRecord | null = null;

  updateDatabase((db) => {
    const record: CommunityCommentRecord = {
      id: crypto.randomUUID(),
      post_id: postId,
      parent_id: parentId ?? undefined,
      author_id: userId,
      author_email: authorEmail,
      text,
      created_at: new Date().toISOString(),
    };
    db.community_comments.push(record);
    created = { ...record };
  });

  if (!created) {
    throw new Error("FAILED_TO_CREATE_COMMENT");
  }
  return created;
}

export function deleteCommentsByPost(postId: string) {
  let removed = 0;
  updateDatabase((db) => {
    const before = db.community_comments.length;
    db.community_comments = db.community_comments.filter(
      (comment) => comment.post_id !== postId,
    );
    removed = before - db.community_comments.length;
  });
  return removed;
}
