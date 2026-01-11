"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";
import { PostComposer } from "@/components/community/post-composer";
import { CommunityPostCard } from "@/components/community/post-card";
import type { CommunityPost } from "@/types/community";

export function CommunityFeed() {
  const t = useTranslations();
  const { toast } = useToast();
  const [feedPosts, setFeedPosts] = useState<CommunityPost[]>([]);
  const [myPosts, setMyPosts] = useState<CommunityPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<CommunityPost[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMine, setLoadingMine] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const loadFeed = async () => {
    setLoadingFeed(true);
    try {
      const response = await fetch("/api/community/posts?scope=feed");
      const data = (await response.json()) as { posts: CommunityPost[] };
      setFeedPosts(data.posts ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.toastErrorTitle,
        description: t.community.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setLoadingFeed(false);
    }
  };

  const loadMine = async () => {
    setLoadingMine(true);
    try {
      const response = await fetch("/api/community/posts?scope=mine");
      const data = (await response.json()) as { posts: CommunityPost[] };
      setMyPosts(data.posts ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.toastErrorTitle,
        description: t.community.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setLoadingMine(false);
    }
  };

  const loadSaved = async () => {
    setLoadingSaved(true);
    try {
      const response = await fetch("/api/community/posts?scope=saved");
      const data = (await response.json()) as { posts: CommunityPost[] };
      setSavedPosts(data.posts ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.toastErrorTitle,
        description: t.community.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    void loadFeed();
    void loadMine();
    void loadSaved();
  }, []);

  const handleCreated = (post: CommunityPost) => {
    setMyPosts((current) => [post, ...current]);
  };

  const handleUpdated = (updated: CommunityPost) => {
    setFeedPosts((current) =>
      current.map((post) => (post.id === updated.id ? updated : post)),
    );
    setMyPosts((current) =>
      current.map((post) => (post.id === updated.id ? updated : post)),
    );
    setSavedPosts((current) => {
      const exists = current.some((post) => post.id === updated.id);
      if (updated.saved_by_me) {
        if (exists) {
          return current.map((post) =>
            post.id === updated.id ? updated : post,
          );
        }
        return [updated, ...current];
      }
      return exists ? current.filter((post) => post.id !== updated.id) : current;
    });
  };

  const handleDeleted = (postId: string) => {
    setFeedPosts((current) => current.filter((post) => post.id !== postId));
    setMyPosts((current) => current.filter((post) => post.id !== postId));
    setSavedPosts((current) => current.filter((post) => post.id !== postId));
  };

  const emptyCopy = useMemo(() => {
    if (activeTab === "mine") {
      return t.community.emptyMine;
    }
    if (activeTab === "saved") {
      return t.community.emptySaved;
    }
    return t.community.emptyFeed;
  }, [activeTab, t]);

  return (
    <div className="space-y-6">
      <PostComposer onCreated={handleCreated} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="feed">{t.community.tabs.feed}</TabsTrigger>
            <TabsTrigger value="mine">{t.community.tabs.mine}</TabsTrigger>
            <TabsTrigger value="saved">{t.community.tabs.saved}</TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void loadFeed();
              void loadMine();
              void loadSaved();
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t.community.refresh}
          </Button>
        </div>
        <TabsContent value="feed">
          {loadingFeed ? (
            <div className="text-sm text-muted-foreground">
              {t.community.loading}
            </div>
          ) : feedPosts.length ? (
            <div className="grid gap-4">
              {feedPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{emptyCopy}</div>
          )}
        </TabsContent>
        <TabsContent value="mine">
          {loadingMine ? (
            <div className="text-sm text-muted-foreground">
              {t.community.loading}
            </div>
          ) : myPosts.length ? (
            <div className="grid gap-4">
              {myPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  showStatus
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{emptyCopy}</div>
          )}
        </TabsContent>
        <TabsContent value="saved">
          {loadingSaved ? (
            <div className="text-sm text-muted-foreground">
              {t.community.loading}
            </div>
          ) : savedPosts.length ? (
            <div className="grid gap-4">
              {savedPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{emptyCopy}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
