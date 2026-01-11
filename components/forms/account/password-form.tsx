"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";

type PasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function PasswordForm() {
  const { toast } = useToast();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, t.passwordForm.validationCurrent),
      newPassword: z.string().min(8, t.passwordForm.validationNew),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t.passwordForm.validationConfirm,
      path: ["confirmPassword"],
    });
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: PasswordValues) => {
    startTransition(async () => {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast({
          title: t.passwordForm.toastErrorTitle,
          description:
            payload?.error ?? t.passwordForm.toastErrorDescription,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t.passwordForm.toastSuccessTitle,
        description: t.passwordForm.toastSuccessDescription,
      });
      form.reset();
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="current-password">{t.passwordForm.currentLabel}</Label>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          {...form.register("currentPassword")}
        />
        {form.formState.errors.currentPassword ? (
          <p className="text-xs text-red-500">
            {form.formState.errors.currentPassword.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">{t.passwordForm.newLabel}</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          {...form.register("newPassword")}
        />
        {form.formState.errors.newPassword ? (
          <p className="text-xs text-red-500">
            {form.formState.errors.newPassword.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">
          {t.passwordForm.confirmLabel}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword ? (
          <p className="text-xs text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? t.passwordForm.saving : t.passwordForm.save}
      </Button>
    </form>
  );
}
