"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";
import { CommunityPostCard } from "@/components/community/post-card";
import type { CommunityPost } from "@/types/community";

export function ModerationQueue() {
  const t = useTranslations();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const loadQueue = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/moderation/posts");
      if (!response.ok) {
        throw new Error("Failed to load moderation queue");
      }
      const data = (await response.json()) as { posts: CommunityPost[] };
      setPosts(data.posts ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: t.moderation.toastErrorTitle,
        description: t.moderation.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const handleUpdated = (updated: CommunityPost) => {
    setPosts((current) =>
      current.map((post) => (post.id === updated.id ? updated : post)),
    );
  };

  const handleDeleted = (postId: string) => {
    setPosts((current) => current.filter((post) => post.id !== postId));
  };

  const handleDecision = async (postId: string, status: "approved" | "rejected") => {
    setBusyId(postId);
    try {
      const response = await fetch(`/api/moderation/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          reason: reasons[postId] || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      setPosts((current) => current.filter((post) => post.id !== postId));
      toast({
        title:
          status === "approved"
            ? t.moderation.toastApprovedTitle
            : t.moderation.toastRejectedTitle,
        description:
          status === "approved"
            ? t.moderation.toastApprovedDescription
            : t.moderation.toastRejectedDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.moderation.toastErrorTitle,
        description: t.moderation.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">{t.moderation.loading}</div>;
  }

  if (!posts.length) {
    return <div className="text-sm text-muted-foreground">{t.moderation.empty}</div>;
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <div key={post.id} className="space-y-3">
          <CommunityPostCard
            post={post}
            showStatus
            showComments={false}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
          <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 md:flex-row md:items-center md:justify-between">
            <Input
              value={reasons[post.id] ?? ""}
              onChange={(event) =>
                setReasons((current) => ({
                  ...current,
                  [post.id]: event.target.value,
                }))
              }
              placeholder={t.moderation.reasonPlaceholder}
              className="md:max-w-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleDecision(post.id, "rejected")}
                disabled={busyId === post.id}
              >
                {t.moderation.reject}
              </Button>
              <Button
                onClick={() => handleDecision(post.id, "approved")}
                disabled={busyId === post.id}
              >
                {t.moderation.approve}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
