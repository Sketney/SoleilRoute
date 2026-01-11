import { NextResponse } from "next/server";
import { z } from "zod";
import { budgetCategories } from "@/lib/constants";
import { getServerSession } from "@/lib/auth/session";
import {
  canEditTrip,
  createNotification,
  deleteBudgetItem,
  getBudgetItemById,
  getTripAccess,
  insertBudgetItem,
  updateBudgetItem,
} from "@/server/db";
import { apiError } from "@/lib/api/responses";

type BudgetCategoryId = (typeof budgetCategories)[number]["id"];
const budgetCategoryIds = new Set<BudgetCategoryId>(
  budgetCategories.map((item) => item.id),
);
const budgetCategoryValues = budgetCategories.map((item) => item.id) as [
  BudgetCategoryId,
  ...BudgetCategoryId[],
];

const createBudgetItemSchema = z.object({
  category: z.enum(budgetCategoryValues),
  amount: z.coerce.number().positive(),
  currency: z
    .string()
    .length(3)
    .transform((value) => value.toUpperCase())
    .optional(),
  description: z.string().max(500).nullable().optional(),
  isPaid: z.boolean().optional(),
});

const updateBudgetItemSchema = z.object({
  id: z.string(),
  category: z.enum(budgetCategoryValues).optional(),
  amount: z.coerce.number().positive().optional(),
  description: z.string().max(500).nullable().optional(),
  isPaid: z.boolean().optional(),
});

const deleteBudgetItemSchema = z.object({
  id: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const body = await request.json().catch(() => null);
  const parsed = createBudgetItemSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

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

  const { category, amount, currency, description, isPaid } = parsed.data;
  if (!budgetCategoryIds.has(category)) {
    return apiError("INVALID_CATEGORY", "Invalid category", 400);
  }

  const normalizedDescription = description?.trim();
  const normalizedCurrency = currency ?? access.trip.currency;

  let itemId: string | null = null;
  try {
    itemId = await insertBudgetItem(access.trip.id, {
      category,
      description: normalizedDescription ? normalizedDescription : null,
      amount,
      currency: normalizedCurrency,
      is_paid: isPaid ?? false,
    });
  } catch (error) {
    console.error("Failed to insert budget item", error);
  }

  if (!itemId) {
    return apiError("CREATE_FAILED", "Unable to add budget item", 500);
  }

  await createNotification(session.user.id, {
    title: "Budget item added",
    message: `${category} - ${amount} ${normalizedCurrency}`,
    type: "info",
    action_url: `/dashboard/trips/${access.trip.id}/budget`,
  });

  return NextResponse.json(
    {
      item: {
        id: itemId,
        category,
        description: normalizedDescription ? normalizedDescription : null,
        amount,
        currency: normalizedCurrency,
        isPaid: isPaid ?? false,
      },
    },
    { status: 201 },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const body = await request.json().catch(() => null);
  const parsed = updateBudgetItemSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

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

  const { id: itemId, category, amount, description, isPaid } = parsed.data;
  if (category && !budgetCategoryIds.has(category)) {
    return apiError("INVALID_CATEGORY", "Invalid category", 400);
  }

  const updates = {
    category,
    amount,
    description:
      description === undefined
        ? undefined
        : description
          ? description.trim()
          : null,
    is_paid: isPaid,
  };

  if (
    updates.category === undefined &&
    updates.amount === undefined &&
    updates.description === undefined &&
    updates.is_paid === undefined
  ) {
    return apiError("NO_UPDATES", "No updates provided", 400);
  }

  const item = await getBudgetItemById(itemId);
  if (!item || item.trip_id !== access.trip.id) {
    return apiError("NOT_FOUND", "Budget item not found", 404);
  }

  try {
    await updateBudgetItem(item.id, updates);
  } catch (error) {
    console.error("Failed to update budget item", error);
    return apiError("UPDATE_FAILED", "Unable to update budget item", 500);
  }

  return NextResponse.json({
    item: {
      id: item.id,
      category: updates.category ?? item.category,
      amount: updates.amount ?? item.amount,
      description:
        updates.description !== undefined ? updates.description : item.description,
      currency: item.currency,
      isPaid:
        updates.is_paid !== undefined ? updates.is_paid : Boolean(item.is_paid),
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const body = await request.json().catch(() => null);
  const parsed = deleteBudgetItemSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

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

  const item = await getBudgetItemById(parsed.data.id);
  if (!item || item.trip_id !== access.trip.id) {
    return apiError("NOT_FOUND", "Budget item not found", 404);
  }

  try {
    await deleteBudgetItem(item.id);
  } catch (error) {
    console.error("Failed to delete budget item", error);
    return apiError("DELETE_FAILED", "Unable to delete budget item", 500);
  }

  return NextResponse.json({ success: true });
}
