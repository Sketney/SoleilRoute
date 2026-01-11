import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { tripFormSchema } from "@/lib/validators/trip";
import type { VisaStatus } from "@/lib/constants";
import { splitBudgetByTier } from "@/lib/budget";
import { convertCurrency } from "@/lib/services/exchange-rate";
import { getVisaRequirement } from "@/lib/services/visa";
import { sendTripSummaryEmail } from "@/lib/services/resend";
import { apiError } from "@/lib/api/responses";
import {
  createTrip,
  createNotification,
  insertBudgetItem,
  listBudgetItems,
  listTripsByUser,
} from "@/server/db";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return apiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  const trips = await listTripsByUser(session.user.id);

  return NextResponse.json({
    trips: trips.map((trip) => ({
      id: trip.id,
      name: trip.name,
      destination_country: trip.destination_country,
      destination_city: trip.destination_city,
      start_date: trip.start_date,
      end_date: trip.end_date,
      total_budget: trip.total_budget,
      budget_tier: trip.budget_tier ?? "mid",
      currency: trip.currency,
      citizenship: trip.citizenship,
      visa_status: trip.visa_status ?? "unknown",
      notes: trip.notes ?? null,
      created_at: trip.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return apiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  const body = await request.json().catch(() => null);
  const validation = tripFormSchema.safeParse(body);

  if (!validation.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", 422, {
      fields: validation.error.flatten(),
    });
  }

  const form = validation.data;
  const normalizedNotes = form.notes?.trim();

  let exchangeRate: number | null = null;
  try {
    const conversion = await convertCurrency(1, form.currency, form.baseCurrency);
    exchangeRate = conversion.rate;
  } catch (error) {
    console.warn("Currency conversion skipped", error);
  }

  let visaStatus: VisaStatus = "unknown";
  let visaCheckedAt: string | null = null;
  try {
    const requirement = await getVisaRequirement(
      form.citizenship,
      form.destinationCountry,
    );
    if (requirement) {
      visaStatus = requirement.visaRequired ? "required" : "not_required";
    }
    visaCheckedAt = new Date().toISOString();
  } catch (error) {
    console.warn("Visa lookup skipped", error);
  }

  const trip = await createTrip(session.user.id, {
    name: form.name,
    destination_country: form.destinationCountry,
    destination_city: form.destinationCity,
    start_date: form.startDate.toISOString(),
    end_date: form.endDate.toISOString(),
    total_budget: form.totalBudget,
    budget_tier: form.travelStyle,
    currency: form.currency,
    citizenship: form.citizenship,
    base_currency: form.baseCurrency,
    exchange_rate: exchangeRate,
    notes: normalizedNotes ? normalizedNotes : null,
    visa_status: visaStatus,
    visa_last_checked: visaCheckedAt,
  });

  await createNotification(session.user.id, {
    title: "Trip created",
    message: `Your trip to ${trip.destination_city} is ready.`,
    type: "success",
    action_url: `/dashboard/trips/${trip.id}`,
  });

  const split = splitBudgetByTier(
    form.totalBudget,
    form.travelStyle,
    visaStatus === "not_required"
      ? { excludeCategories: ["visa"], includeExcluded: true }
      : undefined,
  );
  await Promise.all(
    split.map((item) =>
      insertBudgetItem(trip.id, {
      category: item.category,
      description: null,
      amount: item.amount,
      currency: form.currency,
      is_paid: false,
      }),
    ),
  );

  if (session.user.email) {
    await sendTripSummaryEmail({
      to: session.user.email,
      subject: `Your trip to ${form.destinationCity}`,
      html: `
        <h1>Trip created successfully</h1>
        <p>Your trip <strong>${form.name}</strong> is ready in Travel Planner.</p>
        <ul>
          <li>Destination: ${form.destinationCity}, ${form.destinationCountry}</li>
          <li>Dates: ${form.startDate.toDateString()} - ${form.endDate.toDateString()}</li>
          <li>Budget: ${form.totalBudget} ${form.currency}</li>
        </ul>
        <p>Login to review visa guidance and finalize your budget allocations.</p>
      `,
    });
  }

  const refreshedBudget = await listBudgetItems(trip.id);

  return NextResponse.json(
    {
      trip: {
        id: trip.id,
        name: trip.name,
        destination_country: trip.destination_country,
        destination_city: trip.destination_city,
        start_date: trip.start_date,
        end_date: trip.end_date,
        total_budget: trip.total_budget,
        budget_tier: trip.budget_tier ?? "mid",
        currency: trip.currency,
        citizenship: trip.citizenship,
        base_currency: trip.base_currency,
        exchange_rate: trip.exchange_rate,
        notes: trip.notes ?? null,
        visa_status: trip.visa_status ?? "unknown",
        visa_last_checked: trip.visa_last_checked ?? null,
        budget_items: refreshedBudget,
      },
    },
    { status: 201 },
  );
}

