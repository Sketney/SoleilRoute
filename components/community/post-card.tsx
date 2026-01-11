"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAppSession, useLocale, useTranslations } from "@/components/providers/app-providers";
import { communityTags, type CommunityTag } from "@/lib/moderation/tags";
import { PostComments } from "@/components/community/post-comments";
import type { CommunityPost } from "@/types/community";

const statusStyles: Record<
  CommunityPost["status"],
  { badge: string; text: string }
> = {
  pending: { badge: "bg-warning/15 text-warning", text: "text-warning" },
  approved: { badge: "bg-success/15 text-success", text: "text-success" },
  rejected: { badge: "bg-destructive/15 text-destructive", text: "text-destructive" },
};

export function CommunityPostCard({
  post,
  showStatus = false,
  showComments = true,
  onUpdated,
  onDeleted,
}: {
  post: CommunityPost;
  showStatus?: boolean;
  showComments?: boolean;
  onUpdated?: (post: CommunityPost) => void;
  onDeleted?: (postId: string) => void;
}) {
  const t = useTranslations();
  const { locale } = useLocale();
  const { session } = useAppSession();
  const { toast } = useToast();
  const [currentPost, setCurrentPost] = useState(post);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [draftTag, setDraftTag] = useState<CommunityTag>(post.tag);
  const [draftText, setDraftText] = useState(post.text);
  const [draftMapUrl, setDraftMapUrl] = useState(post.map_url ?? "");

  useEffect(() => {
    setCurrentPost(post);
    setDraftTag(post.tag);
    setDraftText(post.text);
    setDraftMapUrl(post.map_url ?? "");
  }, [post]);

  const canModerate = Boolean(session?.user.is_moderator);
  const statusStyle = statusStyles[currentPost.status];
  const tagLabel = t.community.tags[currentPost.tag];
  const authorName =
    currentPost.author_name?.trim() ||
    currentPost.author_email?.split("@")[0] ||
    t.community.unknownAuthor;
  const authorAvatar = currentPost.author_avatar_url ?? "";
  const createdAt = formatTimestamp(
    locale,
    currentPost.created_at,
    t.common.justNow,
  );
  const tagOptions = useMemo(
    () =>
      communityTags.map((value) => ({
        value,
        label: t.community.tags[value],
      })),
    [t],
  );
  const likeCount = currentPost.like_count ?? 0;
  const saveCount = currentPost.save_count ?? 0;
  const likedByMe = Boolean(currentPost.liked_by_me);
  const savedByMe = Boolean(currentPost.saved_by_me);

  const handleReaction = async (action: "like" | "save") => {
    const enabled = action === "like" ? !likedByMe : !savedByMe;
    try {
      const response = await fetch(
        `/api/community/posts/${currentPost.id}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, enabled }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update reaction");
      }
      const data = (await response.json()) as {
        like_count: number;
        save_count: number;
      };
      setCurrentPost((prev) => {
        const updated = {
          ...prev,
          like_count: data.like_count,
          save_count: data.save_count,
          liked_by_me: action === "like" ? enabled : prev.liked_by_me,
          saved_by_me: action === "save" ? enabled : prev.saved_by_me,
        };
        onUpdated?.(updated);
        return updated;
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.toastErrorTitle,
        description: t.community.toastErrorDescription,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/community/posts/${currentPost.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag: draftTag,
          text: draftText,
          mapUrl: draftMapUrl.trim(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      const data = (await response.json()) as { post: CommunityPost };
      setCurrentPost(data.post);
      setIsEditing(false);
      onUpdated?.(data.post);
      toast({
        title: t.community.actions.toastUpdatedTitle,
        description: t.community.actions.toastUpdatedDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.toastErrorTitle,
        description: t.community.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(t.community.actions.confirmDelete);
    if (!confirmed) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(`/api/community/posts/${currentPost.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      setIsEditing(false);
      onDeleted?.(currentPost.id);
      toast({
        title: t.community.actions.toastDeletedTitle,
        description: t.community.actions.toastDeletedDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.toastErrorTitle,
        description: t.community.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div
        className={cn(
          "grid gap-6",
          showComments
            ? "md:grid-cols-[180px_minmax(0,1fr)_260px]"
            : "md:grid-cols-[180px_minmax(0,1fr)]",
        )}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t.community.detailsTitle}
            </div>
            <div className="mt-3 flex min-w-0 items-center gap-3">
              <Avatar className="h-10 w-10 border border-border/60">
                {authorAvatar ? (
                  <AvatarImage src={authorAvatar} alt={authorName} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <Link
                  href={`/dashboard/community/users/${currentPost.author_id}`}
                  className="block truncate text-sm font-semibold text-foreground hover:underline"
                  title={authorName}
                >
                  {authorName}
                </Link>
                <div className="text-xs text-muted-foreground">{createdAt}</div>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{tagLabel}</Badge>
                {showStatus ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      statusStyle.badge,
                    )}
                  >
                    {t.community.status[currentPost.status]}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          {currentPost.map_url ? (
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href={currentPost.map_url} target="_blank" rel="noreferrer">
                {t.community.viewMap}
              </a>
            </Button>
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-3 text-xs text-muted-foreground">
              {t.community.noMap}
            </div>
          )}
          {canModerate ? (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setIsEditing((current) => !current)}
                disabled={saving || deleting}
              >
                {isEditing ? t.community.actions.cancel : t.community.actions.edit}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleDelete}
                disabled={saving || deleting}
              >
                {t.community.actions.delete}
              </Button>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
              <div className="space-y-2">
                <Label className="text-xs">{t.community.fields.tag}</Label>
                <Select
                  value={draftTag}
                  onValueChange={(value) => setDraftTag(value as CommunityTag)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.community.placeholders.tag} />
                  </SelectTrigger>
                  <SelectContent>
                    {tagOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t.community.fields.text}</Label>
                <Textarea
                  rows={4}
                  value={draftText}
                  onChange={(event) => setDraftText(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t.community.fields.mapUrl}</Label>
                <Input
                  value={draftMapUrl}
                  onChange={(event) => setDraftMapUrl(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? t.community.actions.saving : t.community.actions.save}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setDraftTag(currentPost.tag);
                    setDraftText(currentPost.text);
                    setDraftMapUrl(currentPost.map_url ?? "");
                  }}
                  disabled={saving}
                >
                  {t.community.actions.cancel}
                </Button>
              </div>
            </div>
          ) : null}
          {!isEditing ? (
            <p className="whitespace-pre-wrap text-sm text-foreground/90">
              {currentPost.text}
            </p>
          ) : null}
          {currentPost.image_url ? (
            <div className="h-56 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 sm:h-64 md:h-72">
              <img
                src={currentPost.image_url}
                alt={tagLabel}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Button
              variant={likedByMe ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("like")}
            >
              <Heart className="mr-2 h-4 w-4" />
              {t.community.actions.like} {likeCount}
            </Button>
            <Button
              variant={savedByMe ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("save")}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              {t.community.actions.savePost} {saveCount}
            </Button>
          </div>
          {currentPost.status === "rejected" && currentPost.rejection_reason ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
              {t.community.rejectionReason}: {currentPost.rejection_reason}
            </div>
          ) : null}
        </div>
        {showComments ? (
          <PostComments postId={currentPost.id} />
        ) : null}
      </div>
    </div>
  );
}

function formatTimestamp(locale: string, timestamp: string, fallback: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);
}
