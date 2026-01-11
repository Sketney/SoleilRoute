"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";
import { isAdminEmail } from "@/lib/auth/roles";

type ModeratorUser = {
  id: string;
  email: string;
  is_moderator: boolean;
};

export function ModeratorsPanel() {
  const t = useTranslations();
  const { toast } = useToast();
  const [users, setUsers] = useState<ModeratorUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/moderators");
      if (!response.ok) {
        throw new Error("Failed to load users");
      }
      const data = (await response.json()) as { users: ModeratorUser[] };
      setUsers(data.users ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: t.admin.toastErrorTitle,
        description: t.admin.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => user.email.toLowerCase().includes(term));
  }, [search, users]);

  const toggleModerator = async (user: ModeratorUser, enabled: boolean) => {
    setBusyId(user.id);
    try {
      const response = await fetch("/api/admin/moderators", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, enabled }),
      });
      if (!response.ok) {
        throw new Error("Failed to update moderator");
      }
      setUsers((current) =>
        current.map((entry) =>
          entry.id === user.id ? { ...entry, is_moderator: enabled } : entry,
        ),
      );
      toast({
        title: t.admin.toastUpdatedTitle,
        description: t.admin.toastUpdatedDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.admin.toastErrorTitle,
        description: t.admin.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.admin.searchPlaceholder}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadUsers()}>
          {t.admin.refresh}
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">{t.admin.loading}</div>
      ) : filteredUsers.length ? (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const isAdmin = isAdminEmail(user.email);
            return (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4"
              >
                <div>
                  <div className="text-sm font-semibold">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {isAdmin ? t.admin.adminLabel : t.admin.moderatorLabel}
                  </div>
                </div>
                <Switch
                  checked={isAdmin || user.is_moderator}
                  onCheckedChange={(checked) =>
                    toggleModerator(user, checked)
                  }
                  disabled={busyId === user.id || isAdmin}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">{t.admin.empty}</div>
      )}
    </div>
  );
}

