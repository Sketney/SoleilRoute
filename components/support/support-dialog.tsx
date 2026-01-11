"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SupportValues = {
  email: string;
  subject: string;
  message: string;
};

export function SupportDialog({ defaultEmail }: { defaultEmail?: string }) {
  const { toast } = useToast();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supportSchema = z.object({
    email: z.string().email(t.supportDialog.validationEmail),
    subject: z.string().min(3, t.supportDialog.validationSubject),
    message: z.string().min(10, t.supportDialog.validationMessage),
  });
  const form = useForm<SupportValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      email: defaultEmail ?? "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (defaultEmail) {
      form.setValue("email", defaultEmail);
    }
  }, [defaultEmail, form]);

  const handleSubmit = (values: SupportValues) => {
    startTransition(async () => {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast({
          title: t.supportDialog.toastErrorTitle,
          description:
            payload?.error ?? t.supportDialog.toastErrorDescription,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t.supportDialog.toastSuccessTitle,
        description: t.supportDialog.toastSuccessDescription,
      });
      form.reset({
        email: values.email,
        subject: "",
        message: "",
      });
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t.supportDialog.triggerButton}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t.supportDialog.title}</DialogTitle>
          <DialogDescription>{t.supportDialog.description}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="support-email">{t.supportDialog.emailLabel}</Label>
            <Input
              id="support-email"
              type="email"
              placeholder={t.supportDialog.emailPlaceholder}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-red-500">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-subject">
              {t.supportDialog.subjectLabel}
            </Label>
            <Input
              id="support-subject"
              placeholder={t.supportDialog.subjectPlaceholder}
              {...form.register("subject")}
            />
            {form.formState.errors.subject ? (
              <p className="text-xs text-red-500">
                {form.formState.errors.subject.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-message">
              {t.supportDialog.messageLabel}
            </Label>
            <Textarea
              id="support-message"
              rows={5}
              placeholder={t.supportDialog.messagePlaceholder}
              {...form.register("message")}
            />
            {form.formState.errors.message ? (
              <p className="text-xs text-red-500">
                {form.formState.errors.message.message}
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              {t.supportDialog.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t.supportDialog.sending : t.supportDialog.send}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
