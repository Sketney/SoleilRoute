"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Bell, CheckCheck, Info, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  getUnreadCountServerSnapshot,
  getUnreadCountSnapshot,
  refreshUnreadCount,
  setUnreadCount,
  subscribeToUnreadCount,
} from "@/lib/notifications-store";
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

export function NotificationsMenu() {
  const { locale } = useLocale();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unreadCount = useSyncExternalStore(
    subscribeToUnreadCount,
    getUnreadCountSnapshot,
    getUnreadCountServerSnapshot,
  );
  const localUnreadCount = useMemo(
    () => notifications.filter((item) => !item.read_at).length,
    [notifications],
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      return;
    }
    setLoading(true);
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications ?? []);
        if (typeof data.unreadCount === "number") {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => {
        setNotifications([]);
      })
      .finally(() => setLoading(false));
    refreshUnreadCount();
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ all: true }),
    });
    setUnreadCount(0);
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read_at: item.read_at ?? new Date().toISOString(),
      })),
    );
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setUnreadCount(Math.max(unreadCount - 1, 0));
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read_at: item.read_at ?? new Date().toISOString() }
          : item,
      ),
    );
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
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          data-tour="header-notifications"
          className="relative border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-primary" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t.notifications.menuTitle}</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={markAllRead}
            disabled={localUnreadCount === 0}
          >
            <CheckCheck className="mr-1 h-3 w-3" />
            {t.notifications.markAllRead}
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="px-3 py-4 text-sm text-muted-foreground">
            {t.notifications.loading}
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground">
            {t.notifications.empty}
          </div>
        ) : (
          <div className="max-h-80 overflow-auto">
            {notifications.map((item, index) => {
              const Icon = typeIcons[item.type] ?? Info;
              const isUnread = !item.read_at;
              return (
                <div key={item.id}>
                  <DropdownMenuItem
                    className={cn(
                      "flex flex-col items-start gap-2 py-3",
                      isUnread && "bg-muted/40",
                    )}
                    onSelect={(event) => {
                      event.preventDefault();
                      markRead(item.id);
                    }}
                  >
                    <div className="flex w-full items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full",
                          item.type === "success" && "bg-success/15 text-success",
                          item.type === "warning" && "bg-warning/15 text-warning",
                          item.type === "info" && "bg-info/15 text-info",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-medium">{item.title}</div>
                          {isUnread ? (
                            <span className="rounded-full bg-accent/70 px-2 py-0.5 text-[10px] font-semibold uppercase text-foreground">
                              {t.notifications.newBadge}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.message}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatTimestamp(item.created_at)}
                        </div>
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
                  </DropdownMenuItem>
                  {index < notifications.length - 1 ? (
                    <DropdownMenuSeparator />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/dashboard/notifications" as Route}>
            {t.notifications.viewAll}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
