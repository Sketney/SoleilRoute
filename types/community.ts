import type { CommunityTag } from "@/lib/moderation/tags";

export type CommunityPostStatus = "pending" | "approved" | "rejected";

export type CommunityPost = {
  id: string;
  author_id: string;
  author_email: string;
  author_name?: string;
  author_avatar_url?: string;
  tag: CommunityTag;
  text: string;
  image_url?: string;
  map_url?: string;
  created_at: string;
  status: CommunityPostStatus;
  moderated_by?: string;
  moderated_at?: string;
  rejection_reason?: string;
  like_count?: number;
  save_count?: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
};

export type CommunityComment = {
  id: string;
  post_id: string;
  parent_id?: string | null;
  author_id: string;
  author_email: string;
  text: string;
  created_at: string;
};
