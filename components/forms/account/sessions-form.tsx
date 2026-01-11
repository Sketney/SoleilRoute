"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";

export function SessionsForm({ count }: { count: number }) {
  const { toast } = useToast();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [activeSessions, setActiveSessions] = useState(count);

  const handleRevoke = () => {
    startTransition(async () => {
      const response = await fetch("/api/account/sessions", {
        method: "DELETE",
      });

      if (!response.ok) {
        toast({
          title: t.sessionsForm.toastErrorTitle,
          description: t.sessionsForm.toastErrorDescription,
          variant: "destructive",
        });
        return;
      }

      const payload = (await response.json()) as { revoked: number };
      setActiveSessions((current) =>
        Math.max(current - payload.revoked, 1),
      );
      toast({
        title: t.sessionsForm.toastSuccessTitle,
        description: t.sessionsForm.toastSuccessDescription,
      });
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        {t.sessionsForm.activeLabel}:{" "}
        <span className="font-semibold text-foreground">
          {activeSessions}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRevoke}
        disabled={isPending || activeSessions <= 1}
      >
        {isPending ? t.sessionsForm.revoking : t.sessionsForm.revoke}
      </Button>
    </div>
  );
}
