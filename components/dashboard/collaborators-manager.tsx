"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useLocale, useTranslations } from "@/components/providers/app-providers";

type Collaborator = {
  id: string;
  userId: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  addedAt: string;
};

type PendingInvite = {
  id: string;
  email: string;
  role: "editor" | "viewer";
  createdAt: string;
};

type CollaboratorsManagerProps = {
  tripId: string;
  collaborators: Collaborator[];
  pendingInvites?: PendingInvite[];
  currentUserId: string;
  canManage: boolean;
};

export function CollaboratorsManager({
  tripId,
  collaborators,
  pendingInvites = [],
  currentUserId,
  canManage,
}: CollaboratorsManagerProps) {
  const { toast } = useToast();
  const { locale } = useLocale();
  const t = useTranslations();
  const [items, setItems] = useState<Collaborator[]>(collaborators);
  const [pending, setPending] = useState<PendingInvite[]>(pendingInvites);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      toast({
        title: t.collaborators.toastMissingEmailTitle,
        description: t.collaborators.toastMissingEmailDescription,
        variant: "destructive",
      });
      return;
    }

    setInviting(true);
    try {
      const response = await fetch(`/api/trips/${tripId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add collaborator");
      }

      const payload = (await response.json()) as {
        invitation: PendingInvite;
      };
      setPending((current) => [...current, payload.invitation]);
      setEmail("");
      setRole("editor");
      toast({
        title: t.collaborators.toastInviteTitle,
        description: t.collaborators.toastInviteDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.collaborators.toastInviteErrorTitle,
        description: t.collaborators.toastInviteErrorDescription,
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, nextRole: "editor" | "viewer") => {
    setSavingId(userId);
    try {
      const response = await fetch(`/api/trips/${tripId}/collaborators`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: nextRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      setItems((current) =>
        current.map((entry) =>
          entry.userId === userId ? { ...entry, role: nextRole } : entry,
        ),
      );
      toast({
        title: t.collaborators.toastRoleTitle,
        description: t.collaborators.toastRoleDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.collaborators.toastRoleErrorTitle,
        description: t.collaborators.toastRoleErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    const confirmed = window.confirm(t.collaborators.confirmRemove);
    if (!confirmed) {
      return;
    }

    setSavingId(userId);
    try {
      const response = await fetch(`/api/trips/${tripId}/collaborators`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove collaborator");
      }

      setItems((current) =>
        current.filter((entry) => entry.userId !== userId),
      );
      toast({
        title: t.collaborators.toastRemoveTitle,
        description: t.collaborators.toastRemoveDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.collaborators.toastRemoveErrorTitle,
        description: t.collaborators.toastRemoveErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{t.collaborators.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {t.collaborators.description}
        </p>

        <div className="space-y-3">
        {items.map((entry) => {
          const isOwner = entry.role === "owner";
          return (
              <div
                key={entry.id}
                className="rounded-lg border border-border/60 bg-muted/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {entry.email}
                      {entry.userId === currentUserId
                        ? ` ${t.collaborators.youLabel}`
                        : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.collaborators.addedLabel(
                        new Date(entry.addedAt).toLocaleDateString(locale),
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isOwner ? (
                      <span className="text-xs font-semibold uppercase text-muted-foreground">
                        {t.collaborators.ownerLabel}
                      </span>
                    ) : (
                      <Select
                        value={entry.role}
                        onValueChange={(value) =>
                          handleRoleChange(
                            entry.userId,
                            value as "editor" | "viewer",
                          )
                        }
                        disabled={!canManage || savingId === entry.userId}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">
                            {t.collaborators.roleEditor}
                          </SelectItem>
                          <SelectItem value="viewer">
                            {t.collaborators.roleViewer}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {!isOwner && canManage ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemove(entry.userId)}
                        disabled={savingId === entry.userId}
                      >
                        {t.collaborators.remove}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canManage && pending.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              {t.collaborators.pendingTitle}
            </div>
            {pending.map((invite) => (
              <div
                key={invite.id}
                className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-4 text-sm"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.collaborators.pendingInvite(
                        invite.role === "editor"
                          ? t.collaborators.roleEditor
                          : t.collaborators.roleViewer,
                        new Date(invite.createdAt).toLocaleDateString(locale),
                      )}
                    </p>
                  </div>
                  <span className="text-xs uppercase text-muted-foreground">
                    {t.collaborators.pendingLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {canManage ? (
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4">
            <div className="space-y-4">
              <div className="text-sm font-medium">
                {t.collaborators.inviteTitle}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>{t.collaborators.emailLabel}</Label>
                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t.collaborators.emailPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.collaborators.roleLabel}</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as "editor" | "viewer")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">
                        {t.collaborators.roleEditor}
                      </SelectItem>
                      <SelectItem value="viewer">
                        {t.collaborators.roleViewer}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={handleInvite} disabled={inviting}>
                  {inviting ? t.collaborators.inviting : t.collaborators.sendInvite}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {t.collaborators.viewOnly}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
