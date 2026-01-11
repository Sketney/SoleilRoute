"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";

type NotificationPreferencesFormProps = {
  emailEnabled: boolean;
  inAppEnabled: boolean;
};

export function NotificationPreferencesForm({
  emailEnabled,
  inAppEnabled,
}: NotificationPreferencesFormProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const [emailPreference, setEmailPreference] = useState(emailEnabled);
  const [inAppPreference, setInAppPreference] = useState(inAppEnabled);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailEnabled: emailPreference,
          inAppEnabled: inAppPreference,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }
      toast({
        title: t.notificationPreferences.toastSuccessTitle,
        description: t.notificationPreferences.toastSuccessDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.notificationPreferences.toastErrorTitle,
        description: t.notificationPreferences.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium">
            {t.notificationPreferences.emailTitle}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t.notificationPreferences.emailBody}
          </p>
        </div>
        <Switch
          checked={emailPreference}
          onCheckedChange={(checked) => setEmailPreference(Boolean(checked))}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium">
            {t.notificationPreferences.inAppTitle}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t.notificationPreferences.inAppBody}
          </p>
        </div>
        <Switch
          checked={inAppPreference}
          onCheckedChange={(checked) => setInAppPreference(Boolean(checked))}
        />
      </div>
      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full"
      >
        {saving ? t.notificationPreferences.saving : t.notificationPreferences.save}
      </Button>
    </div>
  );
}
