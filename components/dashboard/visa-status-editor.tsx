"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { visaStatusOptions, type VisaStatus } from "@/lib/constants";
import { refreshUnreadCount } from "@/lib/notifications-store";
import { useLocale, useTranslations } from "@/components/providers/app-providers";

type VisaStatusEditorProps = {
  tripId: string;
  status: VisaStatus;
  lastChecked: string | null;
  readOnly?: boolean;
};

export function VisaStatusEditor({
  tripId,
  status,
  lastChecked,
  readOnly = false,
}: VisaStatusEditorProps) {
  const { toast } = useToast();
  const { locale } = useLocale();
  const t = useTranslations();
  const [value, setValue] = useState<VisaStatus>(status);
  const [saving, setSaving] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(lastChecked);
  const currentLabel = t.visa.statuses[value] ?? t.visa.statuses.unknown;

  const handleChange = async (next: VisaStatus) => {
    setValue(next);
    setSaving(true);
    try {
      const response = await fetch(`/api/trips/${tripId}/visa`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: next }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setCheckedAt(new Date().toISOString());
      void refreshUnreadCount();
      toast({
        title: t.visaStatusEditor.toastSuccessTitle,
        description: t.visaStatusEditor.toastSuccessDescription,
      });
    } catch (error) {
      console.error(error);
      setValue(status);
      toast({
        title: t.visaStatusEditor.toastErrorTitle,
        description: t.visaStatusEditor.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
        <p className="text-xs uppercase text-muted-foreground">
          {t.visaStatusEditor.currentStatusLabel}
        </p>
        <p className="text-sm font-medium">{currentLabel}</p>
      </div>
      <Select
        value={value}
        onValueChange={(next) => handleChange(next as VisaStatus)}
        disabled={saving || readOnly}
      >
        <SelectTrigger>
          <SelectValue placeholder={t.visaStatusEditor.selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {visaStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t.visa.statuses[option.value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {checkedAt ? (
        <p className="text-xs text-muted-foreground">
          {t.visaStatusEditor.lastCheckedLabel}:{" "}
          {new Date(checkedAt).toLocaleString(locale)}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {t.visaStatusEditor.noChecks}
        </p>
      )}
    </div>
  );
}
