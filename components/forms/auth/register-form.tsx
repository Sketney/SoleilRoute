"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";

type RegisterValues = {
  email: string;
  password: string;
  confirm: string;
};

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const registerSchema = z
    .object({
      email: z.string().email(t.auth.register.validation.email),
      password: z.string().min(8, t.auth.register.validation.password),
      confirm: z.string(),
    })
    .superRefine(({ password, confirm }, ctx) => {
      if (password !== confirm) {
        ctx.addIssue({
          code: "custom",
          message: t.auth.register.validation.confirm,
          path: ["confirm"],
        });
      }
    });
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  });

  const handleSubmit = (values: RegisterValues) => {
    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast({
          title: t.auth.register.toast.errorTitle,
          description:
            payload?.error ?? t.auth.register.toast.errorDescription,
          variant: "destructive",
        });
        return;
      }

      router.push("/dashboard");
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-2">
        <Label className="text-sm font-semibold" htmlFor="email">
          {t.auth.register.emailLabel}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </div>
          <Input
            id="email"
            type="email"
            placeholder={t.auth.register.placeholderEmail}
            data-testid="register-email"
            className="h-12 rounded-lg bg-stone-50 pl-10 text-sm shadow-sm focus:border-transparent focus:ring-primary dark:bg-stone-950"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email ? (
          <p className="text-xs text-rose-500">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold" htmlFor="password">
          {t.auth.register.passwordLabel}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <Input
            id="password"
            type="password"
            placeholder={t.auth.register.placeholderPassword}
            data-testid="register-password"
            className="h-12 rounded-lg bg-stone-50 pl-10 text-sm shadow-sm focus:border-transparent focus:ring-primary dark:bg-stone-950"
            {...form.register("password")}
          />
        </div>
        {form.formState.errors.password ? (
          <p className="text-xs text-rose-500">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold" htmlFor="confirm">
          {t.auth.register.confirmLabel}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <Input
            id="confirm"
            type="password"
            placeholder={t.auth.register.placeholderConfirm}
            data-testid="register-confirm"
            className="h-12 rounded-lg bg-stone-50 pl-10 text-sm shadow-sm focus:border-transparent focus:ring-primary dark:bg-stone-950"
            {...form.register("confirm")}
          />
        </div>
        {form.formState.errors.confirm ? (
          <p className="text-xs text-rose-500">
            {form.formState.errors.confirm.message}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-primary text-white shadow-lg shadow-orange-500/20 hover:bg-primary-hover"
        disabled={isPending}
        data-testid="register-submit"
      >
        {isPending ? t.auth.register.submitting : t.auth.register.submit}
      </Button>
    </form>
  );
}
