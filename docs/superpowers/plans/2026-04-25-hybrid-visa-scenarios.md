# Hybrid Visa Scenarios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hybrid visa scenarios to paid trip plans so users can switch visa variants, persist an active scenario, and have snapshot, documents, timeline, reminders, and PDF projection follow the selected visa.

**Architecture:** Extend `TripPlanSnapshot` with `visaScenarios[]` plus `activeVisaScenarioId`, then keep the existing top-level `visa/documents/timeline/reminders` as the projection of the active scenario. Generate scenarios from a hybrid of Travel Buddy-derived rules plus a curated catalog, persist selection through a focused API route, and add a small client-side scenario switcher inside the existing full plan page.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, existing JSON/Supabase dual DB layer, existing full-plan generator and trip plan persistence.

---

## File Structure

**Create**

- `lib/services/full-plan/visa-scenarios/catalog.ts`
- `lib/services/full-plan/visa-scenarios/types.ts`
- `lib/services/full-plan/visa-scenarios/build-scenarios.ts`
- `lib/services/full-plan/visa-scenarios/project-scenario.ts`
- `components/dashboard/trip-plan-visa-scenarios.tsx`
- `app/api/trips/[tripId]/plan/visa-scenario/route.ts`
- `tests/unit/visa-scenarios.test.ts`

**Modify**

- `lib/services/full-plan/types.ts`
- `lib/services/full-plan/build-plan-snapshot.ts`
- `lib/services/full-plan/generate-full-trip-plan.ts`
- `lib/services/full-plan/generate-documents.ts`
- `lib/services/full-plan/generate-timeline.ts`
- `server/db/trip-plans.ts`
- `app/(dashboard)/dashboard/trips/[tripId]/plan/page.tsx`
- `lib/services/full-plan/export-pdf.ts`

**Responsibility map**

- `types.ts`: snapshot and scenario domain model
- `catalog.ts`: curated destination visa catalog and per-kind defaults
- `build-scenarios.ts`: hybrid scenario generation, dedup, default scenario choice
- `project-scenario.ts`: turn one selected scenario into top-level snapshot projection
- `visa-scenario/route.ts`: persist active scenario choice
- `trip-plan-visa-scenarios.tsx`: scenario arrows and optimistic UI switching
- unit tests: normalization, generation, projection, and persistence behavior

### Task 1: Extend the Full Plan Model for Scenario-Aware Snapshots

**Files:**
- Create: `tests/unit/visa-scenarios.test.ts`
- Create: `lib/services/full-plan/visa-scenarios/types.ts`
- Modify: `lib/services/full-plan/types.ts`
- Modify: `lib/services/full-plan/build-plan-snapshot.ts`

- [ ] **Step 1: Write the failing tests for the new snapshot shape and active projection**

```ts
import { describe, expect, it } from "vitest";
import type { TripRecord, BudgetItemRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";

const trip: TripRecord = {
  id: "trip-visa-1",
  user_id: "user-1",
  name: "Seoul remote stay",
  destination_country: "South Korea",
  destination_city: "Seoul",
  start_date: "2026-09-01T00:00:00.000Z",
  end_date: "2026-12-01T00:00:00.000Z",
  total_budget: 5000,
  budget_tier: "mid",
  currency: "USD",
  citizenship: "United States",
  base_currency: "USD",
  exchange_rate: 1,
  notes: null,
  visa_status: "required",
  visa_last_checked: "2026-04-25T10:00:00.000Z",
  created_at: "2026-04-25T09:00:00.000Z",
};

const visa: VisaRequirement = {
  citizenship: "United States",
  destination: "South Korea",
  visaRequired: true,
  visaType: "Tourist Visa",
  validity: "90 days",
  processingTime: "5 business days",
  cost: 0,
  currency: "USD",
  embassyUrl: "https://example.test/embassy",
  applicationUrl: "https://example.test/apply",
  passportValidity: "6 months",
  notes: "Bring onward ticket.",
};

const budgetItems: BudgetItemRecord[] = [];

describe("trip plan visa scenarios", () => {
  it("builds scenario-aware snapshots with an active scenario projection", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "manual_regenerate",
    });

    expect(snapshot.activeVisaScenarioId).toBeTruthy();
    expect(snapshot.visaScenarios.length).toBeGreaterThan(0);
    expect(snapshot.visa.type).toBeTruthy();
    expect(snapshot.documents.length).toBeGreaterThan(3);
    expect(snapshot.timeline.length).toBeGreaterThan(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/visa-scenarios.test.ts`

Expected: FAIL with missing `activeVisaScenarioId` / `visaScenarios` fields or type errors around the current snapshot shape.

- [ ] **Step 3: Add the scenario model and extend the snapshot shape**

```ts
// lib/services/full-plan/visa-scenarios/types.ts
import type {
  PlanDocument,
  PlanTimelineItem,
  TripPlanSnapshot,
} from "@/lib/services/full-plan/types";

export type VisaScenarioKind =
  | "tourist"
  | "business"
  | "student"
  | "digital_nomad"
  | "transit"
  | "work"
  | "api_custom"
  | "generic_entry_requirement";

export type TripPlanVisaScenario = {
  id: string;
  kind: VisaScenarioKind;
  label: string;
  source: string;
  confidence: "high" | "medium" | "low";
  priority: number;
  eligibilityHints: string[];
  visa: TripPlanSnapshot["visa"];
  documents: PlanDocument[];
  timeline: PlanTimelineItem[];
  reminders: PlanTimelineItem[];
  notes: string[];
};
```

```ts
// lib/services/full-plan/types.ts
import type { TripPlanVisaScenario } from "@/lib/services/full-plan/visa-scenarios/types";

export type TripPlanSnapshot = {
  version: number;
  generatedAt: string;
  reason: FullPlanGenerationReason;
  trip: { /* existing trip fields */ };
  visa: { /* existing visa fields */ };
  documents: PlanDocument[];
  timeline: PlanTimelineItem[];
  budget: { /* existing budget fields */ };
  reminders: PlanTimelineItem[];
  visaScenarios: TripPlanVisaScenario[];
  activeVisaScenarioId: string | null;
  sources: PlanSource[];
  disclaimer: string;
};
```

- [ ] **Step 4: Build a minimal compatibility projection in the snapshot builder**

```ts
// lib/services/full-plan/build-plan-snapshot.ts
const baseDocuments = generateDocumentChecklist({ trip, visa });
const baseTimeline = generateTimelinePlan({ trip, visa, now: new Date(generatedAt) });

const defaultScenario = {
  id: visa?.visaType
    ? `tourist-${visa.visaType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    : "generic-entry-requirement",
  kind: visa?.visaRequired ? "tourist" : "generic_entry_requirement",
  label: visa?.visaType ?? "Entry requirements",
  source: visa ? "Travel Buddy" : "SoleilRoute fallback",
  confidence: visa ? "high" : "low",
  priority: 100,
  eligibilityHints: [],
  visa: {
    required: visa ? visa.visaRequired : null,
    type: visa?.visaType ?? null,
    validity: visa?.validity ?? null,
    processingTime: visa?.processingTime ?? null,
    passportValidity: visa?.passportValidity ?? null,
    source: visa ? "Travel Buddy" : "Unavailable",
    checkedAt: trip.visa_last_checked,
    embassyUrl: visa?.embassyUrl ?? null,
    applicationUrl: visa?.applicationUrl ?? null,
    notes: visa?.notes ?? null,
  },
  documents: baseDocuments,
  timeline: baseTimeline,
  reminders: baseTimeline.filter((item) => item.status === "pending"),
  notes: visa?.notes ? [visa.notes] : [],
} as const;

return {
  version: 1,
  generatedAt,
  reason,
  trip: { /* existing trip projection */ },
  visa: defaultScenario.visa,
  documents: defaultScenario.documents,
  timeline: defaultScenario.timeline,
  budget,
  reminders: defaultScenario.reminders,
  visaScenarios: [defaultScenario],
  activeVisaScenarioId: defaultScenario.id,
  sources,
  disclaimer: travelDisclaimer,
};
```

- [ ] **Step 5: Run focused test and full unit suite**

Run: `npm run test -- tests/unit/visa-scenarios.test.ts tests/unit/full-plan.test.ts`

Expected: PASS for the new scenario-aware snapshot assertions and no regression in the existing full plan tests.

- [ ] **Step 6: Commit**

```bash
git add tests/unit/visa-scenarios.test.ts lib/services/full-plan/visa-scenarios/types.ts lib/services/full-plan/types.ts lib/services/full-plan/build-plan-snapshot.ts
git commit -m "feat: add scenario-aware full plan model"
```

### Task 2: Build the Hybrid Scenario Generator and Active Projection Helper

**Files:**
- Create: `lib/services/full-plan/visa-scenarios/catalog.ts`
- Create: `lib/services/full-plan/visa-scenarios/build-scenarios.ts`
- Create: `lib/services/full-plan/visa-scenarios/project-scenario.ts`
- Modify: `lib/services/full-plan/build-plan-snapshot.ts`
- Modify: `lib/services/full-plan/generate-documents.ts`
- Modify: `lib/services/full-plan/generate-timeline.ts`
- Test: `tests/unit/visa-scenarios.test.ts`

- [ ] **Step 1: Expand the failing tests to cover dedup, default selection, and projection**

```ts
import { buildVisaScenarios } from "@/lib/services/full-plan/visa-scenarios/build-scenarios";
import { projectActiveVisaScenario } from "@/lib/services/full-plan/visa-scenarios/project-scenario";

it("merges curated and api-backed scenarios and chooses a stable default", () => {
  const result = buildVisaScenarios({
    trip,
    visa,
    baseSource: "Travel Buddy",
    checkedAt: trip.visa_last_checked,
  });

  expect(result.scenarios.some((item) => item.kind === "tourist")).toBe(true);
  expect(result.activeScenarioId).toBeTruthy();
});

it("reprojects documents and timeline from the selected active scenario", () => {
  const result = buildVisaScenarios({
    trip,
    visa,
    baseSource: "Travel Buddy",
    checkedAt: trip.visa_last_checked,
  });
  const nomad = result.scenarios.find((item) => item.kind === "digital_nomad");
  expect(nomad).toBeTruthy();

  const projected = projectActiveVisaScenario(result.scenarios, nomad!.id);
  expect(projected.activeVisaScenarioId).toBe(nomad!.id);
  expect(projected.documents.some((item) => /income|employment/i.test(item.title + item.description))).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/visa-scenarios.test.ts`

Expected: FAIL because the hybrid generator and projection helper do not exist yet.

- [ ] **Step 3: Add a small curated catalog and scenario builder**

```ts
// lib/services/full-plan/visa-scenarios/catalog.ts
export const curatedVisaCatalog = {
  "South Korea": ["tourist", "business", "student", "digital_nomad", "transit", "work"],
  Japan: ["tourist", "business", "student", "digital_nomad", "transit", "work"],
  Thailand: ["tourist", "business", "student", "digital_nomad", "transit", "work"],
} as const;
```

```ts
// lib/services/full-plan/visa-scenarios/build-scenarios.ts
export function buildVisaScenarios(input: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  baseSource: string;
  checkedAt: string | null;
}) {
  const supportedKinds = curatedVisaCatalog[input.trip.destination_country] ?? ["tourist"];
  const scenarios = supportedKinds.map((kind, index) => {
    const scenarioVisa = {
      required: input.visa ? input.visa.visaRequired : null,
      type: kind === "digital_nomad" ? "Digital nomad visa" : input.visa?.visaType ?? "Entry requirements",
      validity: input.visa?.validity ?? null,
      processingTime: input.visa?.processingTime ?? null,
      passportValidity: input.visa?.passportValidity ?? null,
      source: input.baseSource,
      checkedAt: input.checkedAt,
      embassyUrl: input.visa?.embassyUrl ?? null,
      applicationUrl: input.visa?.applicationUrl ?? null,
      notes: input.visa?.notes ?? null,
    };

    const documents = generateDocumentChecklist({ trip: input.trip, visa: input.visa, scenarioKind: kind });
    const timeline = generateTimelinePlan({ trip: input.trip, visa: input.visa, scenarioKind: kind });

    return {
      id: `${kind}-${input.trip.destination_country.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      kind,
      label: kind.replace(/_/g, " "),
      source: input.baseSource,
      confidence: input.visa ? "high" : "medium",
      priority: 100 - index,
      eligibilityHints: [],
      visa: scenarioVisa,
      documents,
      timeline,
      reminders: timeline.filter((item) => item.status === "pending"),
      notes: scenarioVisa.notes ? [scenarioVisa.notes] : [],
    };
  });

  return {
    scenarios,
    activeScenarioId: scenarios[0]?.id ?? null,
  };
}
```

- [ ] **Step 4: Add the active projection helper and wire it into snapshot generation**

```ts
// lib/services/full-plan/visa-scenarios/project-scenario.ts
export function projectActiveVisaScenario(
  scenarios: TripPlanVisaScenario[],
  activeScenarioId: string | null,
) {
  const activeScenario =
    scenarios.find((item) => item.id === activeScenarioId) ?? scenarios[0] ?? null;

  return {
    activeVisaScenarioId: activeScenario?.id ?? null,
    visa: activeScenario?.visa ?? {
      required: null,
      type: null,
      validity: null,
      processingTime: null,
      passportValidity: null,
      source: "Unavailable",
      checkedAt: null,
      embassyUrl: null,
      applicationUrl: null,
      notes: null,
    },
    documents: activeScenario?.documents ?? [],
    timeline: activeScenario?.timeline ?? [],
    reminders: activeScenario?.reminders ?? [],
  };
}
```

```ts
// lib/services/full-plan/build-plan-snapshot.ts
const builtScenarios = buildVisaScenarios({
  trip,
  visa,
  baseSource: visa ? "Travel Buddy" : "Unavailable",
  checkedAt: trip.visa_last_checked,
});
const projected = projectActiveVisaScenario(
  builtScenarios.scenarios,
  builtScenarios.activeScenarioId,
);

return {
  /* existing metadata */
  visa: projected.visa,
  documents: projected.documents,
  timeline: projected.timeline,
  budget,
  reminders: projected.reminders,
  visaScenarios: builtScenarios.scenarios,
  activeVisaScenarioId: projected.activeVisaScenarioId,
  sources,
  disclaimer: travelDisclaimer,
};
```

- [ ] **Step 5: Add minimal scenario-aware branching in documents and timeline**

```ts
// lib/services/full-plan/generate-documents.ts
export function generateDocumentChecklist({
  trip,
  visa,
  scenarioKind = "tourist",
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  scenarioKind?: string;
}): PlanDocument[] {
  const documents = [/* existing shared documents */];

  if (scenarioKind === "digital_nomad") {
    documents.push({
      title: "Proof of income",
      description: "Prepare recent income statements, bank records, or remote-work income proof.",
      category: "finance",
      required: true,
      dueDate: dueDateFromStart(trip, 60),
    });
  }
}
```

```ts
// lib/services/full-plan/generate-timeline.ts
export function generateTimelinePlan({
  trip,
  visa,
  now = new Date(),
  scenarioKind = "tourist",
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  now?: Date;
  scenarioKind?: string;
}): PlanTimelineItem[] {
  const items = [/* existing timeline logic */];

  if (scenarioKind === "digital_nomad") {
    items.unshift({
      id: "confirm-income-eligibility",
      title: "Confirm income eligibility",
      description: "Verify minimum income thresholds and remote-work eligibility.",
      dueDate: dueDate(trip.start_date, 120, now).date,
      category: "visa",
      status: "pending",
      urgent: dueDate(trip.start_date, 120, now).urgent,
      source: "SoleilRoute timeline generator",
      sortOrder: 0,
    });
  }
}
```

- [ ] **Step 6: Run scenario tests and existing full plan tests**

Run: `npm run test -- tests/unit/visa-scenarios.test.ts tests/unit/full-plan.test.ts`

Expected: PASS with at least one curated alternative scenario, a stable default `activeScenarioId`, and projection that changes documents for a non-tourist scenario.

- [ ] **Step 7: Commit**

```bash
git add lib/services/full-plan/visa-scenarios/catalog.ts lib/services/full-plan/visa-scenarios/build-scenarios.ts lib/services/full-plan/visa-scenarios/project-scenario.ts lib/services/full-plan/build-plan-snapshot.ts lib/services/full-plan/generate-documents.ts lib/services/full-plan/generate-timeline.ts tests/unit/visa-scenarios.test.ts
git commit -m "feat: generate hybrid visa scenarios for trip plans"
```

### Task 3: Persist the Active Scenario Through the Trip Plan API

**Files:**
- Create: `app/api/trips/[tripId]/plan/visa-scenario/route.ts`
- Modify: `server/db/trip-plans.ts`
- Modify: `lib/services/full-plan/generate-full-trip-plan.ts`
- Modify: `tests/unit/visa-scenarios.test.ts`

- [ ] **Step 1: Add a failing persistence-level test for active scenario reprojection**

```ts
import { projectActiveVisaScenario } from "@/lib/services/full-plan/visa-scenarios/project-scenario";

it("keeps the selected scenario id and projects it back into top-level plan fields", () => {
  const built = buildVisaScenarios({
    trip,
    visa,
    baseSource: "Travel Buddy",
    checkedAt: trip.visa_last_checked,
  });
  const student = built.scenarios.find((item) => item.kind === "student");
  expect(student).toBeTruthy();

  const projected = projectActiveVisaScenario(built.scenarios, student!.id);
  expect(projected.activeVisaScenarioId).toBe(student!.id);
  expect(projected.timeline.some((item) => /school|admission|student/i.test(item.title + item.description))).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/visa-scenarios.test.ts`

Expected: FAIL because the scenario-specific student projection is not implemented or not persisted end-to-end.

- [ ] **Step 3: Add a focused trip-plan update helper in the DB layer**

```ts
// server/db/trip-plans.ts
export async function setTripPlanSnapshot(
  tripId: string,
  updater: (plan: TripPlanRecord) => TripPlanRecord,
) {
  const existing = await getTripPlan(tripId);
  if (!existing) {
    return null;
  }
  const next = updater(existing);
  return upsertTripPlan({
    trip_id: next.trip_id,
    user_id: next.user_id,
    status: next.status,
    plan_json: next.plan_json,
    visa_checked_at: next.visa_checked_at,
  });
}
```

- [ ] **Step 4: Add the route that saves `activeVisaScenarioId` and reprojects the plan**

```ts
// app/api/trips/[tripId]/plan/visa-scenario/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/session";
import { hasTripPlanAccessForUser } from "@/lib/services/entitlements";
import { projectActiveVisaScenario } from "@/lib/services/full-plan/visa-scenarios/project-scenario";
import { getTripAccess, getTripPlan, upsertTripPlan } from "@/server/db";

const schema = z.object({ scenarioId: z.string().min(1) });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return apiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return apiError("NOT_FOUND", "Trip not found", 404);
  }
  if (!(await hasTripPlanAccessForUser(session.user, access.trip.id))) {
    return apiError("PAYMENT_REQUIRED", "Full trip plan is locked", 402);
  }

  const plan = await getTripPlan(access.trip.id);
  if (!plan) {
    return apiError("NOT_FOUND", "Trip plan not found", 404);
  }

  const projected = projectActiveVisaScenario(
    plan.plan_json.visaScenarios,
    parsed.data.scenarioId,
  );
  if (!projected.activeVisaScenarioId) {
    return apiError("INVALID_SCENARIO", "Scenario not found", 404);
  }

  const updated = await upsertTripPlan({
    trip_id: plan.trip_id,
    user_id: plan.user_id,
    status: plan.status,
    visa_checked_at: plan.visa_checked_at,
    plan_json: {
      ...plan.plan_json,
      activeVisaScenarioId: projected.activeVisaScenarioId,
      visa: projected.visa,
      documents: projected.documents,
      timeline: projected.timeline,
      reminders: projected.reminders,
    },
  });

  return NextResponse.json({
    activeVisaScenarioId: updated.plan_json.activeVisaScenarioId,
    visa: updated.plan_json.visa,
    documents: updated.plan_json.documents,
    timeline: updated.plan_json.timeline,
    reminders: updated.plan_json.reminders,
  });
}
```

- [ ] **Step 5: Ensure full-plan generation self-heals invalid saved active scenario ids**

```ts
// lib/services/full-plan/generate-full-trip-plan.ts
const snapshot = buildPlanSnapshot({
  trip,
  visa,
  budgetItems,
  generatedAt,
  reason: input.reason,
});

if (
  snapshot.activeVisaScenarioId &&
  !snapshot.visaScenarios.some((item) => item.id === snapshot.activeVisaScenarioId)
) {
  snapshot.activeVisaScenarioId = snapshot.visaScenarios[0]?.id ?? null;
}
```

- [ ] **Step 6: Run targeted tests and type-check**

Run: `npm run test -- tests/unit/visa-scenarios.test.ts`

Run: `npx tsc --noEmit`

Expected: PASS for projection tests and no type regressions in the plan route or persistence helper.

- [ ] **Step 7: Commit**

```bash
git add app/api/trips/[tripId]/plan/visa-scenario/route.ts server/db/trip-plans.ts lib/services/full-plan/generate-full-trip-plan.ts tests/unit/visa-scenarios.test.ts
git commit -m "feat: persist active visa scenario selection"
```

### Task 4: Add the Full Plan Visa Scenario Switcher UI and Wire Export to the Active Scenario

**Files:**
- Create: `components/dashboard/trip-plan-visa-scenarios.tsx`
- Modify: `app/(dashboard)/dashboard/trips/[tripId]/plan/page.tsx`
- Modify: `lib/services/full-plan/export-pdf.ts`
- Test: `tests/unit/pdf-export.test.ts`
- Test: `tests/unit/visa-scenarios.test.ts`

- [ ] **Step 1: Add a failing export test that expects the active scenario label in the PDF**

```ts
import { buildTripPlanPdf } from "@/lib/services/full-plan/export-pdf";

it("exports the active scenario details instead of a stale default", () => {
  const snapshot = buildPlanSnapshot({
    trip,
    visa,
    budgetItems,
    generatedAt: "2026-04-25T12:00:00.000Z",
    reason: "pro_unlock",
  });

  const nomad = snapshot.visaScenarios.find((item) => item.kind === "digital_nomad");
  expect(nomad).toBeTruthy();

  const adjusted = {
    ...snapshot,
    activeVisaScenarioId: nomad!.id,
    visa: nomad!.visa,
    documents: nomad!.documents,
    timeline: nomad!.timeline,
    reminders: nomad!.reminders,
  };

  const pdf = buildTripPlanPdf(adjusted).toString("latin1");
  expect(pdf).toContain(nomad!.label);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pdf-export.test.ts`

Expected: FAIL because the current export content does not include scenario-aware details.

- [ ] **Step 3: Add the scenario switcher client component**

```tsx
// components/dashboard/trip-plan-visa-scenarios.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TripPlanVisaScenarios({
  tripId,
  scenarios,
  activeScenarioId,
}: {
  tripId: string;
  scenarios: Array<{ id: string; label: string; kind: string }>;
  activeScenarioId: string | null;
}) {
  const [index, setIndex] = useState(
    Math.max(0, scenarios.findIndex((item) => item.id === activeScenarioId)),
  );

  const active = scenarios[index] ?? null;

  async function select(nextIndex: number) {
    const bounded = (nextIndex + scenarios.length) % scenarios.length;
    const next = scenarios[bounded];
    if (!next) return;
    setIndex(bounded);
    await fetch(`/api/trips/${tripId}/plan/visa-scenario`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId: next.id }),
    });
    window.location.reload();
  }

  if (!active || scenarios.length <= 1) {
    return active ? <Badge variant="outline">{active.label}</Badge> : null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" size="icon" variant="outline" onClick={() => void select(index - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-0 flex-1 rounded-md border border-border/60 px-3 py-2">
        <div className="truncate text-sm font-medium">{active.label}</div>
        <div className="text-xs text-muted-foreground">{active.kind.replace(/_/g, " ")}</div>
      </div>
      <Button type="button" size="icon" variant="outline" onClick={() => void select(index + 1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Mount the switcher above `Visa snapshot` and keep the rest of the page driven by the projected top-level plan**

```tsx
// app/(dashboard)/dashboard/trips/[tripId]/plan/page.tsx
import { TripPlanVisaScenarios } from "@/components/dashboard/trip-plan-visa-scenarios";

<CardHeader className="space-y-3">
  <CardTitle>Visa snapshot</CardTitle>
  <TripPlanVisaScenarios
    tripId={access.trip.id}
    scenarios={plan.visaScenarios.map((item) => ({
      id: item.id,
      label: item.label,
      kind: item.kind,
    }))}
    activeScenarioId={plan.activeVisaScenarioId}
  />
</CardHeader>
```

- [ ] **Step 5: Make PDF export include the active scenario label**

```ts
// lib/services/full-plan/export-pdf.ts
function buildTextLines(plan: TripPlanSnapshot) {
  const activeScenario =
    plan.visaScenarios.find((item) => item.id === plan.activeVisaScenarioId) ?? null;

  const lines: string[] = [
    "Full trip plan",
    `${plan.trip.name} - ${plan.trip.destination}`,
    activeScenario ? `Active visa scenario: ${activeScenario.label}` : "",
    /* existing lines */
  ];
}
```

- [ ] **Step 6: Run export/unit/build verification**

Run: `npm run test -- tests/unit/pdf-export.test.ts tests/unit/visa-scenarios.test.ts`

Run: `npm run build`

Expected: PASS with the PDF reflecting the selected scenario and the full plan page still building under Next.js.

- [ ] **Step 7: Commit**

```bash
git add components/dashboard/trip-plan-visa-scenarios.tsx app/(dashboard)/dashboard/trips/[tripId]/plan/page.tsx lib/services/full-plan/export-pdf.ts tests/unit/pdf-export.test.ts tests/unit/visa-scenarios.test.ts
git commit -m "feat: add visa scenario switcher to full trip plans"
```

### Task 5: Final Verification and Cleanup

**Files:**
- Modify: any touched files from prior tasks only if verification exposes a concrete defect

- [ ] **Step 1: Run the full verification suite**

Run: `npm run test`

Run: `npx tsc --noEmit`

Run: `npm run lint`

Run: `npm run build`

Expected:

- unit tests pass
- type-check passes
- lint reports no new errors
- Next.js production build succeeds

- [ ] **Step 2: Manually verify the primary paid-user flow**

Run the app and verify:

1. unlock or open a paid full plan
2. switch left/right between scenarios
3. refresh the page
4. confirm the same scenario is still active
5. confirm documents and timeline changed for the selected scenario
6. download the PDF and confirm it references the active scenario

- [ ] **Step 3: Commit final verification-only fixes if needed**

```bash
git add <only-files-fixed-during-verification>
git commit -m "fix: polish visa scenario full plan flow"
```

## Self-Review

### Spec coverage

- hybrid source model: Task 2
- active scenario persistence: Task 3
- arrow-based UI switcher: Task 4
- projection into snapshot/documents/timeline/reminders: Tasks 1-3
- PDF behavior: Task 4
- tests and regression coverage: Tasks 1-5

No spec section is left without a planned task.

### Placeholder scan

- no `TBD` or `TODO`
- each code-changing step includes concrete code
- each test step includes an actual command and expected result

### Type consistency

- `TripPlanVisaScenario`
- `visaScenarios`
- `activeVisaScenarioId`
- `projectActiveVisaScenario`

These names are used consistently across model, generator, API, and UI tasks.
