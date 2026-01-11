"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useLocale,
  useTranslations,
} from "@/components/providers/app-providers";

type PendingInvitation = {
  id: string;
  tripId: string;
  tripName: string;
  destination: string;
  role: "editor" | "viewer";
  invitedBy: string | null;
  createdAt: string;
};

export function PendingInvitations({
  initialInvitations,
}: {
  initialInvitations: PendingInvitation[];
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const [invitations, setInvitations] = useState(initialInvitations);
  const [savingId, setSavingId] = useState<string | null>(null);

  const respond = async (inviteId: string, action: "accept" | "decline") => {
    setSavingId(inviteId);
    try {
      const response = await fetch(`/api/invitations/${inviteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error("Failed to respond");
      }

      setInvitations((current) =>
        current.filter((invite) => invite.id !== inviteId),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
        {t.notifications.invitationEmpty}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invite) => {
        const disabled = savingId === invite.id;
        return (
          <div
            key={invite.id}
            className="rounded-lg border border-border/60 bg-card/80 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{invite.tripName}</span>
                  <Badge variant="secondary">
                    {invite.role === "editor"
                      ? t.notifications.invitationRoleEditor
                      : t.notifications.invitationRoleViewer}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {invite.destination}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t.notifications.invitedBy(
                    invite.invitedBy ?? t.notifications.invitedByFallback,
                    new Date(invite.createdAt).toLocaleDateString(locale),
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => respond(invite.id, "decline")}
                  disabled={disabled}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t.notifications.invitationDecline}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => respond(invite.id, "accept")}
                  disabled={disabled}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {t.notifications.invitationAccept}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
