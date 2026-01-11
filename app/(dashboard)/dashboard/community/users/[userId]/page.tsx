import { notFound } from "next/navigation";
import { CommunityPostCard } from "@/components/community/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "@/lib/auth/session";
import { getTranslations } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  getUserById,
  listLikesByPost,
  listPostsByAuthor,
  listSavesByPost,
  hasUserLiked,
  hasUserSaved,
} from "@/server/db";
import type { CommunityPost } from "@/types/community";

export default async function CommunityUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const locale = await getRequestLocale();
  const t = getTranslations(locale);
  const session = await getServerSession();
  const viewerId = session?.user.id ?? "";

  const { userId } = await params;
  const profileUser = getUserById(userId);
  if (!profileUser) {
    notFound();
  }

  const displayName =
    profileUser.display_name?.trim() ||
    profileUser.email.split("@")[0] ||
    profileUser.email;
  const canSeeAll =
    viewerId === profileUser.id || Boolean(session?.user.is_moderator);

  const posts = listPostsByAuthor(profileUser.id, 200);
  const visiblePosts = canSeeAll
    ? posts
    : posts.filter((post) => post.status === "approved");

  const enrichedPosts: CommunityPost[] = visiblePosts.map((post) => {
    const likeCount = listLikesByPost(post.id).length;
    const saveCount = listSavesByPost(post.id).length;
    return {
      ...post,
      author_name: displayName,
      author_avatar_url: profileUser.avatar_url ?? "",
      like_count: likeCount,
      save_count: saveCount,
      liked_by_me: viewerId ? hasUserLiked(post.id, viewerId) : false,
      saved_by_me: viewerId ? hasUserSaved(post.id, viewerId) : false,
    };
  });

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 border border-border/60">
            {profileUser.avatar_url ? (
              <AvatarImage src={profileUser.avatar_url} alt={displayName} />
            ) : null}
            <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.community.profile.title}
            </p>
            <h1 className="text-xl font-semibold text-foreground">
              {displayName}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t.community.profile.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          {t.community.profile.postsTitle} ({enrichedPosts.length})
        </h2>
        {enrichedPosts.length ? (
          <div className="grid gap-4">
            {enrichedPosts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                showStatus={canSeeAll}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t.community.profile.postsEmpty}
          </p>
        )}
      </div>
    </section>
  );
}
