import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type VisaRequirement = {
  citizenship: string;
  destination: string;
  visaRequired: boolean;
  visaType: string;
  validity: string;
  processingTime: string;
  cost: number;
  currency: string;
  embassyUrl: string;
  notes?: string;
};

const dataset: VisaRequirement[] = [
  {
    citizenship: "USA",
    destination: "Japan",
    visaRequired: false,
    visaType: "Visa Waiver",
    validity: "Up to 90 days",
    processingTime: "Instant on arrival",
    cost: 0,
    currency: "USD",
    embassyUrl: "https://www.us.emb-japan.go.jp/itprtop_en/index.html",
  },
  {
    citizenship: "India",
    destination: "Japan",
    visaRequired: true,
    visaType: "Tourist Visa",
    validity: "Up to 90 days",
    processingTime: "5-7 business days",
    cost: 38,
    currency: "USD",
    embassyUrl: "https://www.in.emb-japan.go.jp/",
  },
];

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { citizenship, destination } = await req.json();

  const result = dataset.find(
    (entry) =>
      entry.citizenship === citizenship &&
      entry.destination.toLowerCase() === String(destination).toLowerCase(),
  );

  return new Response(JSON.stringify({ visa: result ?? null }), {
    headers: { "Content-Type": "application/json" },
  });
});
