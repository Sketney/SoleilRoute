"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";

type ProfileValues = {
  email: string;
  displayName: string;
};

export function ProfileForm({
  email,
  displayName,
  avatarUrl,
}: {
  email: string;
  displayName?: string;
  avatarUrl?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return avatarUrl ?? null;
  }, [avatarFile, avatarUrl]);
  const profileSchema = z.object({
    email: z.string().email(t.profileForm.validationEmail),
    displayName: z
      .string()
      .min(2, t.profileForm.validationDisplayName)
      .max(60, t.profileForm.validationDisplayName),
  });
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email,
      displayName: displayName ?? "",
    },
  });

  useEffect(() => {
    if (!avatarFile || !avatarPreview) {
      return;
    }
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarFile, avatarPreview]);

  const handleSubmit = (values: ProfileValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("displayName", values.displayName.trim());
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast({
          title: t.profileForm.toastErrorTitle,
          description: payload?.error ?? t.profileForm.toastErrorDescription,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t.profileForm.toastSuccessTitle,
        description: t.profileForm.toastSuccessDescription,
      });
      router.refresh();
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="profile-display-name">{t.profileForm.displayNameLabel}</Label>
        <Input
          id="profile-display-name"
          type="text"
          {...form.register("displayName")}
        />
        {form.formState.errors.displayName ? (
          <p className="text-xs text-red-500">
            {form.formState.errors.displayName.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-email">{t.profileForm.emailLabel}</Label>
        <Input
          id="profile-email"
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-red-500">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-avatar">{t.profileForm.avatarLabel}</Label>
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt={t.profileForm.avatarAlt}
              className="h-14 w-14 rounded-full border border-border/60 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border/70 text-xs text-muted-foreground">
              {t.profileForm.avatarPlaceholder}
            </div>
          )}
          <Input
            id="profile-avatar"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setAvatarFile(file);
            }}
          />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? t.profileForm.saving : t.profileForm.save}
      </Button>
    </form>
  );
}
