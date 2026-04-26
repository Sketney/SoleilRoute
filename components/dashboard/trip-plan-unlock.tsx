"use client";

import { useState } from "react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function TripPlanUnlockButton({
  tripId,
  locked,
}: {
  tripId: string;
  locked: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [readyPath, setReadyPath] = useState<Route | null>(null);
  const planPath = `/dashboard/trips/${tripId}/plan` as Route;

  const unlock = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/trips/${tripId}/unlock`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Unable to unlock plan");
      }
      toast({
        title: "Full plan unlocked",
        description: "Your trip plan is ready. Opening it now.",
      });
      setReadyPath(planPath);
      if (pathname === planPath) {
        router.replace(`${planPath}?unlocked=${Date.now()}` as Route, {
          scroll: false,
        });
      } else {
        router.push(planPath, { scroll: false });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Unlock failed",
        description: "We could not unlock the full plan.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  if (!locked || readyPath) {
    return (
      <Button asChild>
        <a href={readyPath ?? planPath}>
          <Sparkles className="mr-2 h-4 w-4" />
          Open full plan
        </a>
      </Button>
    );
  }

  return (
    <Button type="button" onClick={unlock} disabled={pending}>
      <Lock className="mr-2 h-4 w-4" />
      {pending ? "Unlocking..." : "Unlock full trip plan"}
    </Button>
  );
}
