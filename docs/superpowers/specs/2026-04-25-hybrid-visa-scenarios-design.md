# Hybrid Visa Scenarios Design

## Goal

Extend the paid `Full trip plan` experience so a user can browse multiple visa options for a trip, select one as the active scenario, and have the selected scenario drive the visa snapshot, documents, timeline, reminders, and PDF export.

This design uses a hybrid source model:

- live Travel Buddy response for route-specific facts
- SoleilRoute curated visa catalog for structured scenario coverage

The selected scenario is persisted as an `active visa scenario` on the trip plan.

## Scope

In scope:

- paid full-trip-plan users
- hybrid scenario generation
- active visa scenario persistence
- visa snapshot carousel with left/right navigation
- scenario-specific documents, timeline, reminders, and PDF projection
- first curated scenario set:
  - `tourist`
  - `business`
  - `student`
  - `digital_nomad`
  - `transit`
  - `work`

Out of scope for this phase:

- multi-traveler personas
- generalized "all visas in the world" coverage
- country-by-country deep legal accuracy beyond current API plus curated catalog
- admin authoring UI for curated scenario catalogs

## Product Behavior

For a paid trip plan, `Visa snapshot` becomes a scenario-driven module instead of a single static summary.

The user can:

- move left and right across available visa scenarios
- see the active scenario label and source-backed visa details
- persist the selected scenario for the trip
- reopen the trip later and see the same selected scenario

The active scenario controls:

- `Visa snapshot`
- `Documents`
- `Timeline`
- `Reminders`
- `PDF export`

If only one scenario is available, carousel controls may be hidden or disabled.

## Recommended Architecture

Use a snapshot-centered model.

Keep `trip_plans.plan_json` as the main source of truth, but evolve it from a single `visa` payload into a scenario-aware plan:

- add `visaScenarios[]`
- add `activeVisaScenarioId`
- keep existing top-level `visa`, `documents`, `timeline`, and `reminders`

Those existing top-level fields become the projection of the active scenario. This preserves compatibility with current pages and export flows while adding scenario support.

## Data Model

Add a new type to full-plan domain models:

`TripPlanVisaScenario`

Suggested shape:

```ts
type TripPlanVisaScenario = {
  id: string;
  kind:
    | "tourist"
    | "business"
    | "student"
    | "digital_nomad"
    | "transit"
    | "work"
    | "api_custom"
    | "generic_entry_requirement";
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

Extend `TripPlanSnapshot` with:

```ts
visaScenarios: TripPlanVisaScenario[];
activeVisaScenarioId: string | null;
```

The existing fields:

- `visa`
- `documents`
- `timeline`
- `reminders`

remain present and always mirror the current active scenario.

## Scenario Generation Pipeline

### 1. API extraction

Read Travel Buddy data from:

- `primary_rule`
- `secondary_rule`
- `exception_rule`
- `destination.passport_validity`
- `mandatory_registration`
- links and duration values

Normalize raw API labels into a known scenario kind where possible:

- `visa free`
- `visa waiver`
- `eta`
- `evisa`
- `tourist visa`
- `business visa`
- `student visa`
- `work visa`
- `digital nomad visa`
- `transit visa`

If a rule cannot be mapped confidently, create `api_custom`.

### 2. Curated overlay

Introduce a curated visa catalog keyed by destination country.

Each curated entry defines:

- supported scenario kinds
- default label
- eligibility hints
- document templates
- timeline templates
- notes
- priority

Curated entries fill structural gaps even when the API only provides a narrow response.

### 3. Dedup and merge

Merge API-derived and curated scenarios by `kind`.

Fact precedence:

1. manual QA override
2. Travel Buddy
3. curated defaults
4. generic SoleilRoute fallback

If API and curated catalog refer to the same scenario type, create one merged scenario instead of duplicates.

### 4. Default active scenario

Choose default active scenario by relevance:

- prefer `visa_free`, `waiver`, `eta`, `evisa`, or `tourist` for normal short leisure trips
- prefer `digital_nomad` only when the destination catalog supports it and the trip context suggests a longer stay
- prefer `business`, `student`, `work`, or `transit` only when explicit route context or catalog rules justify them

If no structured scenario is available, create a single `generic_entry_requirement` scenario.

## Scenario-Specific Content Rules

### Tourist

Documents:

- passport
- insurance
- itinerary
- accommodation
- proof of funds
- visa approval or eVisa confirmation

Timeline:

- confirm requirements
- collect documents
- submit application
- confirm bookings
- print copies before departure

### Digital nomad

Documents:

- passport
- proof of income
- employment or freelance contract proof
- remote-work declaration if required
- insurance
- accommodation
- tax or residence notes

Timeline:

- confirm eligibility
- gather financial proof
- prepare notarized or translated documents if needed
- submit application
- review tax or registration obligations

### Student

Documents:

- passport
- admission letter
- tuition or enrollment proof
- proof of funds
- insurance
- housing proof
- student visa approval

Timeline:

- secure admission
- gather school and payment records
- complete visa application
- prepare pre-arrival documentation

### Work

Documents:

- passport
- work permit
- employer sponsorship letter
- contract
- insurance
- accommodation

Timeline:

- employer paperwork
- permit preparation
- visa submission
- pre-arrival document review

### Business

Documents:

- passport
- invitation letter
- company support letter
- itinerary
- proof of funds
- business visa approval

Timeline:

- collect company documents
- prepare invitation
- submit application
- confirm meetings and travel

### Transit

Documents:

- passport
- onward ticket
- destination visa if needed
- connection or airport proof

Timeline:

- verify transfer rules
- confirm onward travel
- validate terminal and airport requirements

## Persistence and API

### Stored plan model

The generated trip plan is saved with all available scenarios plus the active scenario id.

### New route

Add:

`PATCH /api/trips/[tripId]/plan/visa-scenario`

Payload:

```json
{ "scenarioId": "string" }
```

Server behavior:

- verify trip access
- verify full plan access
- load stored trip plan
- validate that the scenario exists
- update `activeVisaScenarioId`
- reproject top-level `visa`, `documents`, `timeline`, and `reminders`
- persist updated `trip_plans.plan_json`
- return updated active scenario and projected plan sections

## UI Design

Update `Full trip plan` page.

Inside `Visa snapshot`, add a scenario switcher row:

- left arrow
- active scenario title
- optional small kind badge
- right arrow

When the user changes scenario:

- the active card updates immediately
- visa details update
- documents update
- timeline updates
- source and notes update

Use optimistic UI, then persist with `PATCH`.

On failure:

- revert local selection
- show destructive toast

## Export and Reminders

`PDF export` must always use the active scenario projection currently stored in `trip_plans.plan_json`.

Reminder processing must use the projected top-level `reminders` or the active scenario-derived timeline projection, not a stale default scenario.

## Error Handling

If the API response is sparse:

- still generate curated scenarios where supported
- mark confidence honestly
- do not invent precise legal facts

If no scenario exists:

- create one fallback `generic_entry_requirement`
- keep the UI operational
- show generic official-guidance messaging

If a saved `activeVisaScenarioId` no longer exists after regeneration:

- recalculate default scenario
- update projection
- persist the corrected active scenario id

## Testing

Unit tests:

- normalization from Travel Buddy rules to scenario kinds
- merge and dedup logic
- scenario generation for `tourist`, `digital_nomad`, and `student`
- projection update when active scenario changes

API tests:

- `PATCH /plan/visa-scenario` success path
- invalid `scenarioId`
- locked-plan access denied

UI tests:

- arrows switch scenarios
- documents and timeline change with scenario
- selected scenario persists after refresh

Regression tests:

- PDF export uses active scenario
- existing single-scenario trips still render correctly

## Implementation Notes

Recommended file additions:

- `lib/services/full-plan/visa-scenarios/*`
- curated catalog file under `lib/data` or `lib/services/full-plan`
- scenario projection helper used by page, export, and reminders

Recommended migration strategy:

1. add scenario model and generation
2. preserve top-level projection compatibility
3. add selection API
4. add UI switcher
5. wire PDF and reminders to active scenario

## Risks

- API coverage is not rich enough to represent all real visa pathways
- curated catalog quality becomes product-critical
- overly aggressive default selection may choose the wrong scenario

Mitigations:

- keep confidence visible
- preserve source attribution
- use conservative defaults
- allow user-controlled active scenario selection
