"use client";

import { useState } from "react";
import { RefreshCw, Send, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type {
  VisaCheckRecord,
  VisaIssueReportRecord,
  VisaManualOverrideRecord,
} from "@/server/db/visa-checks";

type VisaQaData = {
  checks: VisaCheckRecord[];
  reports: VisaIssueReportRecord[];
  overrides: VisaManualOverrideRecord[];
};

const emptyForm = {
  citizenship: "",
  destination: "",
  visaRequired: "false",
  visaType: "",
  validity: "",
  processingTime: "",
  cost: "",
  currency: "",
  embassyUrl: "",
  applicationUrl: "",
  passportValidity: "",
  sourceUrl: "",
  notes: "",
};

export function VisaQaPanel({ initialData }: { initialData: VisaQaData }) {
  const { toast } = useToast();
  const [data, setData] = useState(initialData);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/visa-checks");
      if (!response.ok) {
        throw new Error("Failed to load visa QA data");
      }
      setData((await response.json()) as VisaQaData);
    } catch (error) {
      console.error(error);
      toast({
        title: "QA data unavailable",
        description: "Could not refresh visa checks right now.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyCheck = (check: VisaCheckRecord) => {
    setForm({
      citizenship: check.citizenship,
      destination: check.destination,
      visaRequired: String(Boolean(check.visa_required)),
      visaType: check.visa_type ?? "",
      validity: check.validity ?? "",
      processingTime: check.processing_time ?? "",
      cost: check.cost === null ? "" : String(check.cost),
      currency: check.currency ?? "",
      embassyUrl: check.embassy_url ?? "",
      applicationUrl: "",
      passportValidity: "",
      sourceUrl: check.embassy_url ?? "",
      notes: check.notes ?? "",
    });
  };

  const submitOverride = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/visa-overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          visaRequired: form.visaRequired === "true",
          cost: form.cost ? Number(form.cost) : null,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create override");
      }
      toast({
        title: "Manual override saved",
        description: "New checks for this pair will use the QA override first.",
      });
      setForm(emptyForm);
      await refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Override failed",
        description: "Check the required fields and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processReminders = async () => {
    setReminderLoading(true);
    try {
      const response = await fetch("/api/admin/reminders/process", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to process reminders");
      }
      const result = (await response.json()) as {
        scanned: number;
        delivered: number;
      };
      toast({
        title: "Reminders processed",
        description: `Scanned ${result.scanned}, delivered ${result.delivered}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Reminder run failed",
        description: "Could not process reminder notifications.",
        variant: "destructive",
      });
    } finally {
      setReminderLoading(false);
    }
  };

  const setField = (name: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Visa QA</h1>
          <p className="text-sm text-muted-foreground">
            Review API/cache results, user reports, manual overrides, and due reminders.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={processReminders} disabled={reminderLoading}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Run reminders
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Manual override</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Citizenship" value={form.citizenship} onChange={(value) => setField("citizenship", value)} />
              <Field label="Destination" value={form.destination} onChange={(value) => setField("destination", value)} />
              <div className="space-y-2">
                <Label>Visa required</Label>
                <select
                  value={form.visaRequired}
                  onChange={(event) => setField("visaRequired", event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <Field label="Visa type" value={form.visaType} onChange={(value) => setField("visaType", value)} />
              <Field label="Validity" value={form.validity} onChange={(value) => setField("validity", value)} />
              <Field label="Processing" value={form.processingTime} onChange={(value) => setField("processingTime", value)} />
              <Field label="Cost" value={form.cost} onChange={(value) => setField("cost", value)} />
              <Field label="Currency" value={form.currency} onChange={(value) => setField("currency", value)} />
              <Field label="Embassy URL" value={form.embassyUrl} onChange={(value) => setField("embassyUrl", value)} />
              <Field label="Application URL" value={form.applicationUrl} onChange={(value) => setField("applicationUrl", value)} />
              <Field label="Passport validity" value={form.passportValidity} onChange={(value) => setField("passportValidity", value)} />
              <Field label="Source URL" value={form.sourceUrl} onChange={(value) => setField("sourceUrl", value)} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(event) => setField("notes", event.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={submitOverride} disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              Save override
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <QaList
            title="User reports"
            empty="No reports yet."
            items={data.reports.map((report) => ({
              id: report.id,
              title: `${report.citizenship} -> ${report.destination}`,
              meta: `${report.status} - ${new Date(report.created_at).toLocaleString()}`,
              body: report.issue,
              badge: report.status,
            }))}
          />
          <QaList
            title="Active overrides"
            empty="No overrides yet."
            items={data.overrides.map((override) => ({
              id: override.id,
              title: `${override.citizenship} -> ${override.destination}`,
              meta: `${override.visa_required ? "Visa required" : "Visa not required"} - ${new Date(override.updated_at).toLocaleString()}`,
              body: override.notes ?? override.visa_type ?? "",
              badge: override.is_active ? "active" : "inactive",
            }))}
          />
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Recent visa checks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.checks.length ? (
            data.checks.map((check) => (
              <div
                key={check.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {check.citizenship} {"->"} {check.destination}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {check.source} - {new Date(check.checked_at).toLocaleString()} -{" "}
                    {check.found ? "found" : "not found"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={check.visa_required ? "warning" : "success"}>
                    {check.visa_required ? "visa required" : "no visa"}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => applyCheck(check)}>
                    Use as override
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No checks yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function QaList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: Array<{
    id: string;
    title: string;
    meta: string;
    body: string;
    badge: string;
  }>;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{item.title}</p>
                <Badge variant="outline">{item.badge}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
              {item.body ? <p className="mt-2 text-sm">{item.body}</p> : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}
