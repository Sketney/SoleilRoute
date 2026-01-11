"use client";

import { useMemo, useState } from "react";
import { ImagePlus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";
import { containsProhibitedLanguage } from "@/lib/moderation/bad-words";
import { communityTags, type CommunityTag } from "@/lib/moderation/tags";
import type { CommunityPost } from "@/types/community";

const maxImageBytes = 10 * 1024 * 1024;

export function PostComposer({
  onCreated,
}: {
  onCreated: (post: CommunityPost) => void;
}) {
  const t = useTranslations();
  const { toast } = useToast();
  const [tag, setTag] = useState<CommunityTag | "">("");
  const [text, setText] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tagOptions = useMemo(
    () =>
      communityTags.map((value) => ({
        value,
        label: t.community.tags[value],
      })),
    [t],
  );

  const validateMapUrl = (value: string) => {
    if (!value.trim()) return true;
    try {
      const url = new URL(value);
      const allowedHosts = [
        "maps.google.com",
        "www.google.com",
        "maps.app.goo.gl",
        "openstreetmap.org",
        "www.openstreetmap.org",
        "yandex.ru",
        "maps.yandex.ru",
        "yandex.com",
        "maps.yandex.com",
      ];
      return (
        ["http:", "https:"].includes(url.protocol) &&
        allowedHosts.some((host) => url.host.includes(host))
      );
    } catch {
      return false;
    }
  };

  const showPostError = (errorCode?: string) => {
    switch (errorCode) {
      case "TEXT_PROHIBITED":
        toast({
          title: t.community.validation.textProhibitedTitle,
          description: t.community.validation.textProhibitedDescription,
          variant: "destructive",
        });
        return true;
      case "TEXT_TOO_SHORT":
        toast({
          title: t.community.validation.textRequiredTitle,
          description: t.community.validation.textRequiredDescription,
          variant: "destructive",
        });
        return true;
      case "TAG_INVALID":
      case "Invalid tag":
        toast({
          title: t.community.validation.tagRequiredTitle,
          description: t.community.validation.tagRequiredDescription,
          variant: "destructive",
        });
        return true;
      case "MAP_URL_INVALID":
        toast({
          title: t.community.validation.mapInvalidTitle,
          description: t.community.validation.mapInvalidDescription,
          variant: "destructive",
        });
        return true;
      case "IMAGE_TOO_LARGE":
        toast({
          title: t.community.validation.imageSizeTitle,
          description: t.community.validation.imageSizeDescription,
          variant: "destructive",
        });
        return true;
      case "Image or map link is required":
        toast({
          title: t.community.validation.mediaRequiredTitle,
          description: t.community.validation.mediaRequiredDescription,
          variant: "destructive",
        });
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    const trimmedText = text.trim();
    if (!tag) {
      toast({
        title: t.community.validation.tagRequiredTitle,
        description: t.community.validation.tagRequiredDescription,
        variant: "destructive",
      });
      return;
    }
    if (trimmedText.length < 10) {
      toast({
        title: t.community.validation.textRequiredTitle,
        description: t.community.validation.textRequiredDescription,
        variant: "destructive",
      });
      return;
    }
    if (containsProhibitedLanguage(trimmedText)) {
      toast({
        title: t.community.validation.textProhibitedTitle,
        description: t.community.validation.textProhibitedDescription,
        variant: "destructive",
      });
      return;
    }

    if (!imageFile && !mapUrl.trim()) {
      toast({
        title: t.community.validation.mediaRequiredTitle,
        description: t.community.validation.mediaRequiredDescription,
        variant: "destructive",
      });
      return;
    }

    if (mapUrl.trim() && !validateMapUrl(mapUrl)) {
      toast({
        title: t.community.validation.mapInvalidTitle,
        description: t.community.validation.mapInvalidDescription,
        variant: "destructive",
      });
      return;
    }

    if (imageFile && imageFile.size > maxImageBytes) {
      toast({
        title: t.community.validation.imageSizeTitle,
        description: t.community.validation.imageSizeDescription,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("tag", tag);
      formData.append("text", trimmedText);
      if (mapUrl.trim()) {
        formData.append("mapUrl", mapUrl.trim());
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/community/posts", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        let errorCode = "";
        try {
          const payload = (await response.json()) as { error?: string };
          errorCode = payload.error ?? "";
        } catch {
          // noop
        }
        if (!showPostError(errorCode)) {
          toast({
            title: t.community.toastErrorTitle,
            description: t.community.toastErrorDescription,
            variant: "destructive",
          });
        }
        return;
      }
      const data = (await response.json()) as { post: CommunityPost };
      onCreated(data.post);
      setTag("");
      setText("");
      setMapUrl("");
      setImageFile(null);
      toast({
        title: t.community.toastSubmittedTitle,
        description: t.community.toastSubmittedDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.community.toastErrorTitle,
        description: t.community.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{t.community.createTitle}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t.community.createSubtitle}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.community.fields.tag}</Label>
            <Select value={tag} onValueChange={(value) => setTag(value as CommunityTag)}>
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
            <Label>{t.community.fields.mapUrl}</Label>
            <Input
              value={mapUrl}
              onChange={(event) => setMapUrl(event.target.value)}
              placeholder={t.community.placeholders.mapUrl}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>{t.community.fields.text}</Label>
          <Textarea
            rows={4}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t.community.placeholders.text}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.community.fields.image}</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setImageFile(file);
              }}
            />
            <p className="text-xs text-muted-foreground">
              {t.community.mediaHint}
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              {t.community.mediaImageHint}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t.community.mediaMapHint}
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? t.community.posting : t.community.publish}
        </Button>
      </CardContent>
    </Card>
  );
}
