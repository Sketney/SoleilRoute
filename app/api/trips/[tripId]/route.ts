import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { tripFormSchema } from "@/lib/validators/trip";
import { convertCurrency } from "@/lib/services/exchange-rate";
import { getVisaRequirement } from "@/lib/services/visa";
import { canEditTrip, deleteTrip, getTripAccess, isTripOwner, updateTrip } from "@/server/db";
import { apiError } from "@/lib/api/responses";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();

  if (!session) {
    return apiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return apiError("NOT_FOUND", "Trip not found", 404);
  }
  if (!canEditTrip(access.role)) {
    return apiError("FORBIDDEN", "Forbidden", 403);
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

  let exchangeRate = access.trip.exchange_rate ?? null;
  if (
    form.currency !== access.trip.currency ||
    form.baseCurrency !== access.trip.base_currency ||
    exchangeRate === null
  ) {
    try {
      const conversion = await convertCurrency(
        1,
        form.currency,
        form.baseCurrency,
      );
      exchangeRate = conversion.rate;
    } catch (error) {
      console.warn("Currency conversion skipped", error);
    }
  }

  let visaStatus = access.trip.visa_status ?? "unknown";
  let visaCheckedAt = access.trip.visa_last_checked ?? null;
  const destinationChanged =
    form.destinationCountry !== access.trip.destination_country ||
    form.citizenship !== access.trip.citizenship;
  if (destinationChanged) {
    try {
      const requirement = await getVisaRequirement(
        form.citizenship,
        form.destinationCountry,
      );
      if (requirement) {
        visaStatus = requirement.visaRequired ? "required" : "not_required";
      } else {
        visaStatus = "unknown";
      }
      visaCheckedAt = new Date().toISOString();
    } catch (error) {
      console.warn("Visa lookup skipped", error);
    }
  }

  const updated = await updateTrip(access.trip.id, {
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

  if (!updated) {
    return apiError("UPDATE_FAILED", "Unable to update trip", 500);
  }

  return NextResponse.json({
    trip: {
      id: updated.id,
      name: updated.name,
      destination_country: updated.destination_country,
      destination_city: updated.destination_city,
      start_date: updated.start_date,
      end_date: updated.end_date,
      total_budget: updated.total_budget,
      budget_tier: updated.budget_tier ?? "mid",
      currency: updated.currency,
      citizenship: updated.citizenship,
      base_currency: updated.base_currency,
      exchange_rate: updated.exchange_rate,
      notes: updated.notes ?? null,
      visa_status: updated.visa_status ?? "unknown",
      visa_last_checked: updated.visa_last_checked ?? null,
      created_at: updated.created_at,
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return apiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return apiError("NOT_FOUND", "Trip not found", 404);
  }
  if (!isTripOwner(access.role)) {
    return apiError("FORBIDDEN", "Forbidden", 403);
  }

  try {
    await deleteTrip(access.trip.id);
  } catch (error) {
    console.error("Failed to delete trip", error);
    return apiError("DELETE_FAILED", "Unable to delete trip", 500);
  }

  return NextResponse.json({ success: true });
}
