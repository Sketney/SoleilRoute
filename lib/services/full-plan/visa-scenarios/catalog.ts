export type CuratedVisaScenarioKind =
  | "tourist"
  | "digital_nomad"
  | "business"
  | "student"
  | "family_visit"
  | "working_holiday";

export type CuratedVisaScenarioTemplate = {
  kind: CuratedVisaScenarioKind;
  label: string;
  visaTypeOverride?: string | null;
  notesAppend?: string;
};

const catalog: Record<string, CuratedVisaScenarioTemplate[]> = {
  indonesia: [
    {
      kind: "tourist",
      label: "Tourist / short stay",
    },
    {
      kind: "digital_nomad",
      label: "Digital nomad",
      visaTypeOverride: "Remote worker / digital nomad pathway",
      notesAppend:
        "Remote work stays may require income evidence, employment or client contracts, and longer-stay accommodation planning.",
    },
    {
      kind: "business",
      label: "Business visit",
      visaTypeOverride: "Business visit visa / eVisa",
      notesAppend:
        "Business travel often depends on invitation letters, meeting agendas, and employer support documents.",
    },
  ],
  portugal: [
    {
      kind: "tourist",
      label: "Tourist / short stay",
    },
    {
      kind: "digital_nomad",
      label: "Digital nomad",
      visaTypeOverride: "Digital nomad visa",
      notesAppend:
        "Longer remote-work stays commonly require income proof, accommodation plans, and private insurance.",
    },
  ],
  spain: [
    {
      kind: "tourist",
      label: "Tourist / short stay",
    },
    {
      kind: "digital_nomad",
      label: "Digital nomad",
      visaTypeOverride: "International remote worker visa",
      notesAppend:
        "Remote worker pathways can require contract evidence, tax checks, and proof of recurring income.",
    },
    {
      kind: "student",
      label: "Student",
      visaTypeOverride: "Student visa / study authorization",
      notesAppend:
        "Study stays commonly need enrollment confirmations, proof of funds, and accommodation planning.",
    },
  ],
};

function normalizeCountry(country: string) {
  return country.trim().toLowerCase();
}

export function getCuratedVisaScenarioCatalog(country: string) {
  return catalog[normalizeCountry(country)] ?? [];
}
