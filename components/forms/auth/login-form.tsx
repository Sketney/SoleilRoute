"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const loginSchema = z.object({
    email: z.string().email(t.auth.login.validation.email),
    password: z.string().min(6, t.auth.login.validation.password),
  });
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: LoginValues) => {
    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast({
          title: t.auth.login.toast.errorTitle,
          description:
            payload?.error ?? t.auth.login.toast.errorDescription,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t.auth.login.toast.successTitle,
        description: t.auth.login.toast.successDescription,
      });
      router.push("/dashboard");
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-2">
        <Label className="text-sm font-semibold" htmlFor="email">
          {t.auth.login.emailLabel}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </div>
          <Input
            id="email"
            type="email"
            placeholder={t.auth.login.placeholderEmail}
            data-testid="login-email"
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
          {t.auth.login.passwordLabel}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <Input
            id="password"
            type="password"
            placeholder={t.auth.login.placeholderPassword}
            data-testid="login-password"
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
      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-primary text-white shadow-lg shadow-orange-500/20 hover:bg-primary-hover"
        disabled={isPending}
        data-testid="login-submit"
      >
        {isPending ? t.auth.login.submitting : t.auth.login.submit}
      </Button>
    </form>
  );
}
