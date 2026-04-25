import type {
  PlanDocument,
  PlanTimelineItem,
  TripPlanVisaDetails,
} from "@/lib/services/full-plan/types";

export type TripPlanVisaScenario = {
  id: string;
  label: string;
  isDefault: boolean;
  visa: TripPlanVisaDetails;
  documents: PlanDocument[];
  timeline: PlanTimelineItem[];
  reminders: PlanTimelineItem[];
};
