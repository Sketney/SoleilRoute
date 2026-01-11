import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";

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

export function listLikesByPost(postId: string): CommunityLikeRecord[] {
  const db = readDatabase();
  return db.community_likes
    .filter((entry) => entry.post_id === postId)
    .map((entry) => ({ ...entry }));
}

export function listSavesByPost(postId: string): CommunitySaveRecord[] {
  const db = readDatabase();
  return db.community_saves
    .filter((entry) => entry.post_id === postId)
    .map((entry) => ({ ...entry }));
}

export function hasUserLiked(postId: string, userId: string) {
  const db = readDatabase();
  return db.community_likes.some(
    (entry) => entry.post_id === postId && entry.user_id === userId,
  );
}

export function hasUserSaved(postId: string, userId: string) {
  const db = readDatabase();
  return db.community_saves.some(
    (entry) => entry.post_id === postId && entry.user_id === userId,
  );
}

export function toggleLike(postId: string, userId: string, enabled: boolean) {
  let liked = false;
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

export function toggleSave(postId: string, userId: string, enabled: boolean) {
  let saved = false;
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

export function listSavedPostIdsByUser(userId: string): string[] {
  const db = readDatabase();
  return db.community_saves
    .filter((entry) => entry.user_id === userId)
    .map((entry) => entry.post_id);
}

export function deleteReactionsByPost(postId: string) {
  updateDatabase((db) => {
    db.community_likes = db.community_likes.filter(
      (entry) => entry.post_id !== postId,
    );
    db.community_saves = db.community_saves.filter(
      (entry) => entry.post_id !== postId,
    );
  });
}
