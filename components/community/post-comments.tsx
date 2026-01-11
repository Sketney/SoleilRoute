"use client";

import { useMemo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLocale, useTranslations } from "@/components/providers/app-providers";
import type { CommunityComment } from "@/types/community";

export function PostComments({ postId }: { postId: string }) {
  const t = useTranslations();
  const { locale } = useLocale();
  const { toast } = useToast();
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/community/posts/${postId}/comments?limit=50`,
      );
      if (!response.ok) {
        throw new Error("Failed to load comments");
      }
      const data = (await response.json()) as { comments: CommunityComment[] };
      setComments(data.comments ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.comments.toastErrorTitle,
        description: t.community.comments.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadComments();
  }, [postId]);

  const submitComment = async (body: { text: string; parentId?: string | null }) => {
    const trimmed = body.text.trim();
    if (!trimmed) {
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmed,
          parentId: body.parentId ?? null,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }
      const data = (await response.json()) as { comment: CommunityComment };
      setComments((current) =>
        [...current, data.comment].sort((a, b) =>
          a.created_at.localeCompare(b.created_at),
        ),
      );
      if (body.parentId) {
        setReplyText("");
        setReplyTo(null);
      } else {
        setText("");
      }
      toast({
        title: t.community.comments.toastSuccessTitle,
        description: t.community.comments.toastSuccessDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.comments.toastErrorTitle,
        description: t.community.comments.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    await submitComment({ text });
  };

  const handleReplySubmit = async () => {
    if (!replyTo) {
      return;
    }
    await submitComment({ text: replyText, parentId: replyTo });
  };

  const { rootComments, repliesByParent } = useMemo(() => {
    const roots: CommunityComment[] = [];
    const children = new Map<string, CommunityComment[]>();
    comments.forEach((comment) => {
      if (comment.parent_id) {
        if (!children.has(comment.parent_id)) {
          children.set(comment.parent_id, []);
        }
        children.get(comment.parent_id)?.push(comment);
      } else {
        roots.push(comment);
      }
    });
    roots.sort((a, b) => a.created_at.localeCompare(b.created_at));
    children.forEach((list) =>
      list.sort((a, b) => a.created_at.localeCompare(b.created_at)),
    );
    return { rootComments: roots, repliesByParent: children };
  }, [comments]);

  const renderComment = (comment: CommunityComment, depth = 0) => {
    const authorName =
      comment.author_email?.split("@")[0] || t.community.unknownAuthor;
    const replies = repliesByParent.get(comment.id) ?? [];
    return (
      <div
        key={comment.id}
        className={[
          "rounded-lg border border-border/60 bg-background/60 p-3",
          depth > 0 ? "ml-4 border-l-2 border-l-border/60" : "",
        ].join(" ")}
      >
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate">{authorName}</span>
          <span>{formatTimestamp(locale, comment.created_at)}</span>
        </div>
        <p className="mt-2 text-xs text-foreground/90">{comment.text}</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className="text-[11px] font-medium text-primary hover:underline"
            onClick={() =>
              setReplyTo((current) => (current === comment.id ? null : comment.id))
            }
          >
            {t.community.comments.reply}
          </button>
          {replyTo === comment.id ? (
            <button
              type="button"
              className="text-[11px] text-muted-foreground hover:underline"
              onClick={() => {
                setReplyTo(null);
                setReplyText("");
              }}
            >
              {t.community.actions.cancel}
            </button>
          ) : null}
        </div>
        {replyTo === comment.id ? (
          <div className="mt-2 space-y-2">
            <Input
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder={t.community.comments.placeholder}
            />
            <Button
              size="sm"
              onClick={handleReplySubmit}
              disabled={submitting}
            >
              {submitting
                ? t.community.comments.submitting
                : t.community.comments.submit}
            </Button>
          </div>
        ) : null}
        {replies.length ? (
          <div className="mt-3 space-y-2">
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>{t.community.comments.title}</span>
        <span>{comments.length}</span>
      </div>
      <div className="mt-3 max-h-56 space-y-3 overflow-y-auto pr-1">
        {loading ? (
          <div className="text-xs text-muted-foreground">
            {t.community.comments.loading}
          </div>
        ) : rootComments.length ? (
          rootComments.map((comment) => renderComment(comment))
        ) : (
          <div className="text-xs text-muted-foreground">
            {t.community.comments.empty}
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t.community.comments.placeholder}
        />
        <Button
          size="sm"
          className="w-full"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? t.community.comments.submitting
            : t.community.comments.submit}
        </Button>
      </div>
    </div>
  );
}

function formatTimestamp(locale: string, timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);
}
