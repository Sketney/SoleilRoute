"use client";

import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { refreshUnreadCount } from "@/lib/notifications-store";
import { useTranslations } from "@/components/providers/app-providers";

type TimelineItem = {
  id: string;
  title: string;
  dueDate: string;
  type: "milestone" | "payment";
  status: "pending" | "completed";
  notes: string | null;
  amount: number | null;
  currency: string | null;
};

type EditableTimelineItem = {
  id: string;
  title: string;
  dueDate: string;
  type: "milestone" | "payment";
  status: "pending" | "completed";
  notes: string;
  amount: string;
};

type NewTimelineItem = {
  title: string;
  dueDate: string;
  type: "milestone" | "payment";
  notes: string;
  amount: string;
};

type TimelinePlannerProps = {
  tripId: string;
  currency: string;
  items: TimelineItem[];
  readOnly?: boolean;
};

function toInputDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

export function TimelinePlanner({
  tripId,
  currency,
  items,
  readOnly = false,
}: TimelinePlannerProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editableItems, setEditableItems] = useState<EditableTimelineItem[]>(
    items.map((item) => ({
      id: item.id,
      title: item.title,
      dueDate: toInputDate(item.dueDate),
      type: item.type,
      status: item.status,
      notes: item.notes ?? "",
      amount: item.amount ? String(item.amount) : "",
    })),
  );
  const [newItem, setNewItem] = useState<NewTimelineItem>({
    title: "",
    dueDate: "",
    type: "milestone",
    notes: "",
    amount: "",
  });
  const typeLabels = {
    milestone: t.timeline.typeMilestone,
    payment: t.timeline.typePayment,
  };

  const computeDueLabel = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return { label: t.timeline.dueNoDate, tone: "muted" as const };
    }
    const today = new Date();
    const diffMs = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return {
        label: t.timeline.dueOverdue(Math.abs(diffDays)),
        tone: "danger" as const,
      };
    }
    if (diffDays <= 7) {
      return {
        label: t.timeline.dueIn(diffDays),
        tone: "warning" as const,
      };
    }
    return { label: t.timeline.dueIn(diffDays), tone: "muted" as const };
  };

  const updateItem = (id: string, patch: Partial<EditableTimelineItem>) => {
    setEditableItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const patchTimelineItem = async (
    item: EditableTimelineItem,
    payload: Partial<{
      title: string;
      dueDate: string;
      type: "milestone" | "payment";
      status: "pending" | "completed";
      notes: string | null;
      amount: number | null;
    }>,
  ) => {
    const response = await fetch(`/api/trips/${tripId}/timeline`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.id,
        ...payload,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update item");
    }

    return (await response.json()) as { item: TimelineItem };
  };

  const handleSave = async (item: EditableTimelineItem) => {
    if (!item.title.trim() || !item.dueDate) {
      toast({
        title: t.timeline.toastMissingDetailsTitle,
        description: t.timeline.toastMissingDetailsDescription,
        variant: "destructive",
      });
      return;
    }

    let amountValue: number | null = null;
    if (item.amount) {
      const parsedAmount = Number(item.amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        toast({
          title: t.timeline.toastInvalidAmountTitle,
          description: t.timeline.toastInvalidAmountDescription,
          variant: "destructive",
        });
        return;
      }
      amountValue = parsedAmount;
    }

    setSavingId(item.id);
    try {
      const payload = await patchTimelineItem(item, {
        title: item.title.trim(),
        dueDate: item.dueDate,
        type: item.type,
        status: item.status,
        notes: item.notes.trim() ? item.notes.trim() : null,
        amount: amountValue ?? null,
      });

      setEditableItems((current) =>
        current.map((existing) =>
          existing.id === payload.item.id
            ? {
                id: payload.item.id,
                title: payload.item.title,
                dueDate: toInputDate(payload.item.dueDate),
                type: payload.item.type,
                status: payload.item.status,
                notes: payload.item.notes ?? "",
                amount: payload.item.amount ? String(payload.item.amount) : "",
              }
            : existing,
        ),
      );
      setSavedId(item.id);
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
      savedTimerRef.current = setTimeout(() => {
        setSavedId((current) => (current === item.id ? null : current));
      }, 2000);
      void refreshUnreadCount();
      toast({
        title: t.timeline.toastUpdateTitle,
        description: t.timeline.toastUpdateDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.timeline.toastUpdateErrorTitle,
        description: t.timeline.toastUpdateErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleStatus = async (
    item: EditableTimelineItem,
    next: boolean,
  ) => {
    const previous = item.status;
    updateItem(item.id, { status: next ? "completed" : "pending" });
    setSavingId(item.id);
    try {
      const payload = await patchTimelineItem(item, {
        status: next ? "completed" : "pending",
      });
      setEditableItems((current) =>
        current.map((existing) =>
          existing.id === payload.item.id
            ? { ...existing, status: payload.item.status }
            : existing,
        ),
      );
      void refreshUnreadCount();
    } catch (error) {
      console.error(error);
      updateItem(item.id, { status: previous });
      toast({
        title: t.timeline.toastStatusErrorTitle,
        description: t.timeline.toastStatusErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async () => {
    if (!newItem.title.trim() || !newItem.dueDate) {
      toast({
        title: t.timeline.toastMissingDetailsTitle,
        description: t.timeline.toastMissingDetailsDescription,
        variant: "destructive",
      });
      return;
    }

    let amountValue: number | null = null;
    if (newItem.amount) {
      const parsedAmount = Number(newItem.amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        toast({
          title: t.timeline.toastInvalidAmountTitle,
          description: t.timeline.toastInvalidAmountDescription,
          variant: "destructive",
        });
        return;
      }
      amountValue = parsedAmount;
    }

    setCreating(true);
    try {
      const response = await fetch(`/api/trips/${tripId}/timeline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newItem.title.trim(),
          dueDate: newItem.dueDate,
          type: newItem.type,
          status: "pending",
          notes: newItem.notes.trim() ? newItem.notes.trim() : null,
          amount: amountValue ?? null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      const payload = (await response.json()) as { item: TimelineItem };
      setEditableItems((current) => [
        ...current,
        {
          id: payload.item.id,
          title: payload.item.title,
          dueDate: toInputDate(payload.item.dueDate),
          type: payload.item.type,
          status: payload.item.status,
          notes: payload.item.notes ?? "",
          amount: payload.item.amount ? String(payload.item.amount) : "",
        },
      ]);
      setNewItem({
        title: "",
        dueDate: "",
        type: "milestone",
        notes: "",
        amount: "",
      });
      void refreshUnreadCount();
      toast({
        title: t.timeline.toastAddTitle,
        description: t.timeline.toastAddDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.timeline.toastAddErrorTitle,
        description: t.timeline.toastAddErrorDescription,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (item: EditableTimelineItem) => {
    const confirmed = window.confirm(t.timeline.confirmDelete);
    if (!confirmed) {
      return;
    }

    setSavingId(item.id);
    try {
      const response = await fetch(`/api/trips/${tripId}/timeline`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setEditableItems((current) =>
        current.filter((existing) => existing.id !== item.id),
      );
      void refreshUnreadCount();
      toast({
        title: t.timeline.toastDeleteTitle,
        description: t.timeline.toastDeleteDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.timeline.toastDeleteErrorTitle,
        description: t.timeline.toastDeleteErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const sortedItems = useMemo(() => {
    return [...editableItems].sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate),
    );
  }, [editableItems]);

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{t.timeline.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {t.timeline.description}
        </p>

        {sortedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t.timeline.empty}
          </p>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => {
              const dueLabel = computeDueLabel(item.dueDate);
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 bg-card/70 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t.timeline.fieldTitle}</Label>
                      <Input
                        value={item.title}
                        onChange={(event) =>
                          updateItem(item.id, { title: event.target.value })
                        }
                        disabled={readOnly}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.timeline.fieldDueDate}</Label>
                      <Input
                        type="date"
                        value={item.dueDate}
                        onChange={(event) =>
                          updateItem(item.id, { dueDate: event.target.value })
                        }
                        disabled={readOnly}
                      />
                      <p
                        className={
                          dueLabel.tone === "danger"
                            ? "text-xs text-destructive"
                            : dueLabel.tone === "warning"
                              ? "text-xs text-warning"
                              : "text-xs text-muted-foreground"
                        }
                      >
                        {dueLabel.label}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t.timeline.fieldType}</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value) =>
                          updateItem(item.id, {
                            type: value as "milestone" | "payment",
                          })
                        }
                        disabled={readOnly}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(typeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t.timeline.fieldAmount} ({currency})
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="10"
                        value={item.amount}
                        onChange={(event) =>
                          updateItem(item.id, { amount: event.target.value })
                        }
                        placeholder={t.timeline.optionalAmount}
                        disabled={readOnly || item.type !== "payment"}
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex items-center gap-2 pb-2">
                        <Checkbox
                          checked={item.status === "completed"}
                          onCheckedChange={(checked) =>
                            handleToggleStatus(item, Boolean(checked))
                          }
                          id={`status-${item.id}`}
                          disabled={readOnly}
                        />
                        <Label htmlFor={`status-${item.id}`}>
                          {item.status === "completed"
                            ? t.timeline.statusCompleted
                            : t.timeline.statusPending}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>{t.timeline.fieldNotes}</Label>
                    <Textarea
                      rows={2}
                      value={item.notes}
                      onChange={(event) =>
                        updateItem(item.id, { notes: event.target.value })
                      }
                      placeholder={t.timeline.notesPlaceholder}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-3">
                    {savedId === item.id ? (
                      <span className="text-xs font-medium text-success">
                        {t.timeline.itemSaved}
                      </span>
                    ) : null}
                    {!readOnly ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDelete(item)}
                          disabled={savingId === item.id}
                        >
                          {t.timeline.remove}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleSave(item)}
                          disabled={savingId === item.id}
                        >
                          {savingId === item.id
                            ? t.timeline.saving
                            : t.timeline.saveChanges}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!readOnly ? (
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4">
            <div className="space-y-4">
              <div className="text-sm font-medium">{t.timeline.addTitle}</div>
              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>{t.timeline.fieldTitle}</Label>
                  <Input
                    value={newItem.title}
                    onChange={(event) =>
                      setNewItem((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder={t.timeline.newTitlePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.timeline.fieldDueDate}</Label>
                  <Input
                    type="date"
                    value={newItem.dueDate}
                    onChange={(event) =>
                      setNewItem((current) => ({
                        ...current,
                        dueDate: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.timeline.fieldType}</Label>
                  <Select
                    value={newItem.type}
                    onValueChange={(value) =>
                      setNewItem((current) => ({
                        ...current,
                        type: value as "milestone" | "payment",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    {t.timeline.fieldAmount} ({currency})
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="10"
                    value={newItem.amount}
                    onChange={(event) =>
                      setNewItem((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    placeholder={t.timeline.optionalAmount}
                    disabled={newItem.type !== "payment"}
                  />
                </div>
                <div className="space-y-2 md:col-span-6">
                  <Label>{t.timeline.fieldNotes}</Label>
                  <Textarea
                    rows={2}
                    value={newItem.notes}
                    onChange={(event) =>
                      setNewItem((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    placeholder={t.timeline.newNotesPlaceholder}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating}
                >
                  {creating ? t.timeline.adding : t.timeline.addButton}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {t.timeline.viewOnly}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
