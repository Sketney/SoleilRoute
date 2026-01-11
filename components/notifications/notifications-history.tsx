"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { CheckCheck, Info, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { refreshUnreadCount, setUnreadCount } from "@/lib/notifications-store";
import {
  useLocale,
  useTranslations,
} from "@/components/providers/app-providers";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  action_url: string | null;
  created_at: string;
  read_at: string | null;
};

const typeIcons: Record<NotificationItem["type"], typeof Info> = {
  info: Info,
  success: Sparkles,
  warning: ShieldAlert,
};

export function NotificationsHistory({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let items = notifications;

    if (term) {
      items = items.filter((item) =>
        `${item.title} ${item.message}`.toLowerCase().includes(term),
      );
    }

    if (statusFilter !== "all") {
      items = items.filter((item) =>
        statusFilter === "unread" ? !item.read_at : item.read_at,
      );
    }

    if (typeFilter !== "all") {
      items = items.filter((item) => item.type === typeFilter);
    }

    return items;
  }, [notifications, search, statusFilter, typeFilter]);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications?limit=200");
      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }
      const payload = (await response.json()) as {
        notifications?: NotificationItem[];
        unreadCount?: number;
      };
      setNotifications(payload.notifications ?? []);
      if (typeof payload.unreadCount === "number") {
        setUnreadCount(payload.unreadCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read_at: item.read_at ?? new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
    void refreshUnreadCount();
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read_at: item.read_at ?? new Date().toISOString() }
          : item,
      ),
    );
    void refreshUnreadCount();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return t.common.justNow;
    }
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder={t.notifications.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="md:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder={t.notifications.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.notifications.statusAll}</SelectItem>
              <SelectItem value="unread">{t.notifications.statusUnread}</SelectItem>
              <SelectItem value="read">{t.notifications.statusRead}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder={t.notifications.typePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.notifications.typeAll}</SelectItem>
              <SelectItem value="success">{t.notifications.typeSuccess}</SelectItem>
              <SelectItem value="warning">{t.notifications.typeWarning}</SelectItem>
              <SelectItem value="info">{t.notifications.typeInfo}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={refresh} disabled={loading}>
            {loading ? t.notifications.refreshing : t.notifications.refresh}
          </Button>
          <Button type="button" variant="outline" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            {t.notifications.markAllRead}
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
          {t.notifications.noMatches}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = typeIcons[item.type] ?? Info;
            const isUnread = !item.read_at;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border border-border/60 bg-card/80 p-4 shadow-sm",
                  isUnread && "bg-muted/30",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full",
                        item.type === "success" && "bg-success/15 text-success",
                        item.type === "warning" && "bg-warning/15 text-warning",
                        item.type === "info" && "bg-info/15 text-info",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{item.title}</p>
                        {isUnread ? (
                          <Badge variant="secondary">{t.notifications.newBadge}</Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.message}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatTimestamp(item.created_at)}
                      </p>
                      {item.action_url ? (
                        <Link
                          href={item.action_url as Route}
                          className="text-xs font-medium text-link"
                        >
                          {t.notifications.viewDetails}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  {isUnread ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => markRead(item.id)}
                    >
                      {t.notifications.markRead}
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
