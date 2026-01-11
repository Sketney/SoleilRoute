"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  budgetCategories,
  type BudgetCategoryId,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { refreshUnreadCount } from "@/lib/notifications-store";
import { useTranslations } from "@/components/providers/app-providers";

type BudgetItem = {
  id: string;
  category: BudgetCategoryId;
  description: string | null;
  amount: number;
  currency: string;
  isPaid: boolean;
};

type EditableBudgetItem = {
  id: string;
  category: BudgetCategoryId;
  description: string;
  amount: string;
  currency: string;
  isPaid: boolean;
};

type NewBudgetItem = {
  category: BudgetCategoryId;
  description: string;
  amount: string;
  isPaid: boolean;
};

interface BudgetItemsEditorProps {
  tripId: string;
  currency: string;
  totalBudget: number;
  items: BudgetItem[];
  readOnly?: boolean;
  onItemsChange?: (items: BudgetItem[]) => void;
}

export function BudgetItemsEditor({
  tripId,
  currency,
  totalBudget,
  items,
  readOnly = false,
  onItemsChange,
}: BudgetItemsEditorProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editableItems, setEditableItems] = useState<EditableBudgetItem[]>(
    items.map((item) => ({
      id: item.id,
      category: item.category,
      description: item.description ?? "",
      amount: Number.isFinite(item.amount) ? String(item.amount) : "",
      currency: item.currency,
      isPaid: item.isPaid,
    })),
  );
  const [newItem, setNewItem] = useState<NewBudgetItem>({
    category: budgetCategories[0]?.id ?? "other",
    description: "",
    amount: "",
    isPaid: false,
  });

  useEffect(() => {
    if (!onItemsChange) {
      return;
    }
    onItemsChange(
      editableItems.map((item) => {
        const amount = Number(item.amount);
        return {
          id: item.id,
          category: item.category,
          description: item.description.trim() ? item.description.trim() : null,
          amount: Number.isFinite(amount) ? amount : 0,
          currency: item.currency,
          isPaid: item.isPaid,
        };
      }),
    );
  }, [editableItems, onItemsChange]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
    };
  }, []);

  const updateItem = (id: string, patch: Partial<EditableBudgetItem>) => {
    setEditableItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const patchBudgetItem = async (
    item: EditableBudgetItem,
    payload: {
      category?: BudgetCategoryId;
      amount?: number;
      description?: string | null;
      isPaid?: boolean;
    },
  ) => {
    const response = await fetch(`/api/trips/${tripId}/budget`, {
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

    return (await response.json()) as {
      item: {
        id: string;
        category: BudgetCategoryId;
        description: string | null;
        amount: number;
        currency: string;
        isPaid: boolean;
      };
    };
  };

  const handleSave = async (item: EditableBudgetItem) => {
    const amountValue = Number(item.amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      toast({
        title: t.budgetItems.toastInvalidAmountTitle,
        description: t.budgetItems.toastInvalidAmountDescription,
        variant: "destructive",
      });
      return;
    }

    setSavingId(item.id);
    try {
      const payload = await patchBudgetItem(item, {
        category: item.category,
        amount: amountValue,
        description: item.description.trim() ? item.description.trim() : null,
        isPaid: item.isPaid,
      });

      setEditableItems((current) =>
        current.map((existing) =>
          existing.id === payload.item.id
            ? {
                ...existing,
                category: payload.item.category,
                description: payload.item.description ?? "",
                amount: String(payload.item.amount),
                currency: payload.item.currency,
                isPaid: payload.item.isPaid,
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
      toast({
        title: t.budgetItems.toastSaveTitle,
        description: t.budgetItems.toastSaveDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.budgetItems.toastSaveErrorTitle,
        description: t.budgetItems.toastSaveErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleTogglePaid = async (item: EditableBudgetItem, next: boolean) => {
    const previous = item.isPaid;
    updateItem(item.id, { isPaid: next });
    setSavingId(item.id);
    try {
      const payload = await patchBudgetItem(item, { isPaid: next });
      setEditableItems((current) =>
        current.map((existing) =>
          existing.id === payload.item.id
            ? { ...existing, isPaid: payload.item.isPaid }
            : existing,
        ),
      );
    } catch (error) {
      console.error(error);
      updateItem(item.id, { isPaid: previous });
      toast({
        title: t.budgetItems.toastToggleErrorTitle,
        description: t.budgetItems.toastToggleErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async () => {
    const amountValue = Number(newItem.amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      toast({
        title: t.budgetItems.toastInvalidAmountTitle,
        description: t.budgetItems.toastInvalidAmountDescription,
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`/api/trips/${tripId}/budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: newItem.category,
          amount: amountValue,
          currency,
          description: newItem.description.trim()
            ? newItem.description.trim()
            : null,
          isPaid: newItem.isPaid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      const payload = (await response.json()) as {
        item: {
          id: string;
          category: BudgetCategoryId;
          description: string | null;
          amount: number;
          currency: string;
          isPaid: boolean;
        };
      };

      setEditableItems((current) => [
        ...current,
        {
          id: payload.item.id,
          category: payload.item.category,
          description: payload.item.description ?? "",
          amount: String(payload.item.amount),
          currency: payload.item.currency,
          isPaid: payload.item.isPaid,
        },
      ]);
      setNewItem((current) => ({
        ...current,
        description: "",
        amount: "",
        isPaid: false,
      }));
      void refreshUnreadCount();
      toast({
        title: t.budgetItems.toastAddTitle,
        description: t.budgetItems.toastAddDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.budgetItems.toastAddErrorTitle,
        description: t.budgetItems.toastAddErrorDescription,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (item: EditableBudgetItem) => {
    const confirmed = window.confirm(t.budgetItems.confirmDelete);
    if (!confirmed) {
      return;
    }

    setSavingId(item.id);
    try {
      const response = await fetch(`/api/trips/${tripId}/budget`, {
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
      toast({
        title: t.budgetItems.toastDeleteTitle,
        description: t.budgetItems.toastDeleteDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.budgetItems.toastDeleteErrorTitle,
        description: t.budgetItems.toastDeleteErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const totals = editableItems.reduce(
    (acc, item) => {
      const amount = Number(item.amount);
      const safeAmount = Number.isFinite(amount) ? amount : 0;
      acc.planned += safeAmount;
      if (item.isPaid) {
        acc.paid += safeAmount;
      }
      return acc;
    },
    { planned: 0, paid: 0 },
  );
  const remainingBudget = totalBudget - totals.planned;
  const outstanding = Math.max(totals.planned - totals.paid, 0);

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{t.budgetItems.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm md:grid-cols-3">
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              {t.budgetItems.summaryPlanned}
            </div>
            <div className="text-base font-semibold">
              {formatCurrency(totals.planned, currency)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              {t.budgetItems.summaryPaid}
            </div>
            <div className="text-base font-semibold">
              {formatCurrency(totals.paid, currency)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              {remainingBudget >= 0
                ? t.budgetItems.summaryRemaining
                : t.budgetItems.summaryOverBudget}
            </div>
            <div className="text-base font-semibold">
              {formatCurrency(Math.abs(remainingBudget), currency)}
            </div>
            {outstanding > 0 ? (
              <div className="text-xs text-muted-foreground">
                {formatCurrency(outstanding, currency)}{" "}
                {t.budgetItems.summaryOutstanding}
              </div>
            ) : null}
          </div>
        </div>
        {editableItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t.budgetItems.noItems}
          </p>
        ) : (
          <div className="space-y-4">
            {editableItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border/60 bg-card/70 p-4"
              >
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>{t.budgetItems.categoryLabel}</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) =>
                        updateItem(item.id, {
                          category: value as BudgetCategoryId,
                        })
                      }
                      disabled={readOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {t.budget.categories[category.id]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{t.budgetItems.descriptionLabel}</Label>
                    <Input
                      value={item.description}
                      onChange={(event) =>
                        updateItem(item.id, { description: event.target.value })
                      }
                      placeholder={t.budgetItems.editDescriptionPlaceholder}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {t.budgetItems.amountLabel} ({item.currency})
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={item.amount}
                      onChange={(event) =>
                        updateItem(item.id, { amount: event.target.value })
                      }
                      disabled={readOnly}
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="flex items-center gap-2 pb-2">
                      <Checkbox
                        checked={item.isPaid}
                        onCheckedChange={(checked) =>
                          handleTogglePaid(item, Boolean(checked))
                        }
                        id={`paid-${item.id}`}
                        disabled={readOnly}
                      />
                      <Label htmlFor={`paid-${item.id}`}>
                        {t.budgetItems.paidLabel}
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-3">
                  {savedId === item.id ? (
                    <span className="text-xs font-medium text-success">
                      {t.budgetItems.savedLabel}
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
                        {t.budgetItems.remove}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleSave(item)}
                        disabled={savingId === item.id}
                      >
                        {savingId === item.id
                          ? t.budgetItems.saving
                          : t.budgetItems.saveChanges}
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {!readOnly ? (
          <div
            className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4"
            data-testid="budget-new-item"
          >
            <div className="space-y-4">
              <div className="text-sm font-medium">{t.budgetItems.addTitle}</div>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>{t.budgetItems.categoryLabel}</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) =>
                      setNewItem((current) => ({
                        ...current,
                        category: value as BudgetCategoryId,
                      }))
                    }
                  >
                    <SelectTrigger data-testid="budget-new-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {t.budget.categories[category.id]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>{t.budgetItems.descriptionLabel}</Label>
                  <Input
                    value={newItem.description}
                    onChange={(event) =>
                      setNewItem((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder={t.budgetItems.newDescriptionPlaceholder}
                    data-testid="budget-new-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t.budgetItems.amountLabel} ({currency})
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={newItem.amount}
                    onChange={(event) =>
                      setNewItem((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    data-testid="budget-new-amount"
                  />
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex items-center gap-2 pb-2">
                    <Checkbox
                      checked={newItem.isPaid}
                      onCheckedChange={(checked) =>
                        setNewItem((current) => ({
                          ...current,
                          isPaid: Boolean(checked),
                        }))
                      }
                      id="new-item-paid"
                      data-testid="budget-new-paid"
                    />
                    <Label htmlFor="new-item-paid">
                      {t.budgetItems.paidLabel}
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating}
                  data-testid="budget-new-submit"
                >
                  {creating ? t.budgetItems.adding : t.budgetItems.addButton}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {t.budgetItems.viewOnly}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
