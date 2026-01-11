import { NextResponse } from "next/server";
import { z } from "zod";
import { budgetCategories } from "@/lib/constants";
import { getServerSession } from "@/lib/auth/session";
import {
  canEditTrip,
  getTripAccess,
  listBudgetCaps,
  setBudgetCaps,
} from "@/server/db";

type BudgetCategoryId = (typeof budgetCategories)[number]["id"];
const budgetCategoryIds = new Set<BudgetCategoryId>(
  budgetCategories.map((item) => item.id),
);
const budgetCategoryValues = budgetCategories.map((item) => item.id) as [
  BudgetCategoryId,
  ...BudgetCategoryId[],
];

const capSchema = z.object({
  category: z.enum(budgetCategoryValues),
  limit: z.coerce.number().positive(),
});

const updateCapsSchema = z.object({
  caps: z.array(capSchema),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  const caps = await listBudgetCaps(tripId);
  return NextResponse.json({
    caps: caps.map((cap) => ({
      id: cap.id,
      category: cap.category,
      limit: cap.limit_amount,
      currency: cap.currency,
    })),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!canEditTrip(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateCapsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const normalizedCaps = parsed.data.caps
    .filter((cap) => budgetCategoryIds.has(cap.category))
    .map((cap) => ({
      category: cap.category,
      limit_amount: cap.limit,
      currency: access.trip.currency,
    }));

  const updated = await setBudgetCaps(tripId, normalizedCaps);

  return NextResponse.json({
    caps: updated.map((cap) => ({
      id: cap.id,
      category: cap.category,
      limit: cap.limit_amount,
      currency: cap.currency,
    })),
  });
}
