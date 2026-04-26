import { describe, expect, it } from "vitest";
import { buildTripPlanPdf } from "@/lib/services/full-plan/export-pdf";
import type { TripPlanSnapshot } from "@/lib/services/full-plan/types";

const snapshot: TripPlanSnapshot = {
  version: 1,
  generatedAt: "2026-04-25T12:00:00.000Z",
  reason: "pro_unlock",
  trip: {
    id: "trip-1",
    name: "Tokyo plan",
    destination: "Japan",
    dates: {
      start: "2026-08-01T00:00:00.000Z",
      end: "2026-08-12T00:00:00.000Z",
    },
    citizenship: "United States",
  },
  visaScenarios: [
    {
      id: "japan-tourist",
      label: "Tourist / short stay",
      isDefault: true,
      visa: {
        required: false,
        type: "Visa waiver",
        validity: "90 days",
        processingTime: "Instant",
        passportValidity: "Valid for stay",
        source: "Travel Buddy",
        checkedAt: "2026-04-25T11:00:00.000Z",
        embassyUrl: "https://example.test",
        applicationUrl: null,
        notes: "Proof of onward travel may be required.",
      },
      documents: [
        {
          id: "passport",
          title: "Passport",
          description: "Bring your passport.",
          category: "identity",
          required: true,
          status: "pending",
          dueDate: null,
          source: "generated",
          sortOrder: 1,
        },
      ],
      timeline: [
        {
          id: "book",
          title: "Book hotels",
          description: "Confirm refundable hotels.",
          dueDate: "2026-07-01T00:00:00.000Z",
          category: "booking",
          status: "pending",
          urgent: false,
          source: "generated",
          sortOrder: 1,
        },
      ],
      reminders: [],
    },
    {
      id: "japan-remote-work",
      label: "Remote work stay",
      isDefault: false,
      visa: {
        required: true,
        type: "Digital nomad pathway",
        validity: "6 months",
        processingTime: "Check official guidance",
        passportValidity: "6 months",
        source: "Travel Buddy",
        checkedAt: "2026-04-25T11:00:00.000Z",
        embassyUrl: "https://example.test",
        applicationUrl: "https://example.test/digital-nomad",
        notes: "Longer stays need remote work eligibility evidence.",
      },
      documents: [
        {
          id: "income-proof",
          title: "Income proof",
          description: "Bring remote work income evidence.",
          category: "finance",
          required: true,
          status: "pending",
          dueDate: null,
          source: "generated",
          sortOrder: 1,
        },
      ],
      timeline: [
        {
          id: "prepare-income-proof",
          title: "Prepare income proof",
          description: "Collect remote work income documents.",
          dueDate: "2026-06-20T00:00:00.000Z",
          category: "visa",
          status: "pending",
          urgent: false,
          source: "generated",
          sortOrder: 1,
        },
      ],
      reminders: [],
    },
  ],
  activeVisaScenarioId: "japan-remote-work",
  visa: {
    required: true,
    type: "Digital nomad pathway",
    validity: "6 months",
    processingTime: "Check official guidance",
    passportValidity: "6 months",
    source: "Travel Buddy",
    checkedAt: "2026-04-25T11:00:00.000Z",
    embassyUrl: "https://example.test",
    applicationUrl: "https://example.test/digital-nomad",
    notes: "Longer stays need remote work eligibility evidence.",
  },
  documents: [
    {
      id: "income-proof",
      title: "Income proof",
      description: "Bring remote work income evidence.",
      category: "finance",
      required: true,
      status: "pending",
      dueDate: null,
      source: "generated",
      sortOrder: 1,
    },
  ],
  timeline: [
    {
      id: "prepare-income-proof",
      title: "Prepare income proof",
      description: "Collect remote work income documents.",
      dueDate: "2026-06-20T00:00:00.000Z",
      category: "visa",
      status: "pending",
      urgent: false,
      source: "generated",
      sortOrder: 1,
    },
  ],
  budget: {
    total: 1200,
    currency: "USD",
    items: [
      {
        category: "accommodation",
        amount: 800,
        currency: "USD",
        source: "user_input",
        confidence: "high",
        editable: true,
      },
    ],
  },
  reminders: [],
  sources: [
    {
      label: "Visa requirements",
      source: "Travel Buddy",
      checkedAt: "2026-04-25T11:00:00.000Z",
      confidence: "high",
    },
  ],
  disclaimer: "For planning purposes only.",
};

describe("trip plan PDF export", () => {
  it("creates a valid PDF document with the saved plan content", () => {
    const pdf = buildTripPlanPdf(snapshot);
    const text = pdf.toString("latin1");

    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text).toContain("Full trip plan");
    expect(text).toContain("Japan");
    expect(text).toContain("Digital nomad pathway");
    expect(text).toContain("Remote work stay");
    expect(text).toContain("%%EOF");
  });
});
