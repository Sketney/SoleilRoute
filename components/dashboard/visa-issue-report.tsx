"use client";

import { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function VisaIssueReport({
  tripId,
  citizenship,
  destination,
}: {
  tripId: string;
  citizenship: string;
  destination: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (issue.trim().length < 8) {
      toast({
        title: "Add a short note",
        description: "Tell us what looks incorrect before sending the report.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/visa/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          citizenship,
          destination,
          issue: issue.trim(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit visa issue report");
      }
      setIssue("");
      setOpen(false);
      toast({
        title: "Visa report sent",
        description: "The SoleilRoute QA view now has this item for review.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not send report",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          Visa data QA
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setOpen((value) => !value)}
        >
          Report issue
        </Button>
      </div>
      {open ? (
        <div className="space-y-2">
          <Textarea
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            placeholder="What looks incorrect or outdated?"
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="button" size="sm" onClick={submit} disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Sending..." : "Send to QA"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
