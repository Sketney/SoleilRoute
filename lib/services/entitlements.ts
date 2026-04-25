import {
  createPurchase,
  createTripEntitlement,
  listActiveSubscriptionsByUser,
  listTripEntitlementsByUser,
} from "@/server/db";

export type EntitlementSnapshot = {
  tripEntitlements: Array<{
    trip_id: string;
    entitlement_type: "trip_pass" | "pro_subscription" | "admin_grant";
    status: "active" | "revoked" | "expired";
    expires_at: string | null;
  }>;
  subscriptions: Array<{
    plan: "monthly_pro" | "annual_pro";
    status: string;
    current_period_end: string | null;
  }>;
};

function isNotExpired(expiresAt: string | null | undefined, now: Date) {
  if (!expiresAt) {
    return true;
  }
  return new Date(expiresAt) > now;
}

export function evaluateTripPlanAccess(
  snapshot: EntitlementSnapshot,
  tripId: string,
  now = new Date(),
) {
  const hasActivePro = snapshot.subscriptions.some(
    (subscription) =>
      subscription.status === "active" &&
      isNotExpired(subscription.current_period_end, now),
  );
  if (hasActivePro) {
    return true;
  }

  return snapshot.tripEntitlements.some(
    (entitlement) =>
      entitlement.trip_id === tripId &&
      entitlement.status === "active" &&
      isNotExpired(entitlement.expires_at, now),
  );
}

export async function hasTripPlanAccess(userId: string, tripId: string) {
  const snapshot: EntitlementSnapshot = {
    tripEntitlements: await listTripEntitlementsByUser(userId),
    subscriptions: await listActiveSubscriptionsByUser(userId),
  };
  return evaluateTripPlanAccess(snapshot, tripId);
}

export type UnlockOption = {
  productType: "trip_pass" | "monthly_pro" | "annual_pro";
  label: string;
  price: number;
  currency: string;
};

export async function getUnlockOptions(
  userId: string,
  tripId: string,
): Promise<UnlockOption[]> {
  if (await hasTripPlanAccess(userId, tripId)) {
    return [];
  }
  return [
    {
      productType: "trip_pass",
      label: "Trip Pass",
      price: Number(process.env.NEXT_PUBLIC_TRIP_PASS_PRICE ?? 5.99),
      currency: "USD",
    },
    {
      productType: "monthly_pro",
      label: "Monthly Pro",
      price: Number(process.env.NEXT_PUBLIC_MONTHLY_PRO_PRICE ?? 7.99),
      currency: "USD",
    },
  ];
}

export async function grantTripPass(
  userId: string,
  tripId: string,
  purchaseId: string,
) {
  await createTripEntitlement({
    user_id: userId,
    trip_id: tripId,
    entitlement_type: "trip_pass",
    status: "active",
    source_purchase_id: purchaseId,
    expires_at: null,
  });
}

export async function grantMockTripPass(userId: string, tripId: string) {
  const purchase = await createPurchase({
    user_id: userId,
    trip_id: tripId,
    product_type: "trip_pass",
    provider: "mock",
    provider_checkout_id: null,
    provider_payment_id: `mock_${tripId}`,
    status: "paid",
    amount: Number(process.env.NEXT_PUBLIC_TRIP_PASS_PRICE ?? 5.99),
    currency: "USD",
    paid_at: new Date().toISOString(),
    metadata: { mode: "mock" },
  });
  await grantTripPass(userId, tripId, purchase.id);
  return purchase;
}

export async function hasActivePro(userId: string) {
  const subscriptions = await listActiveSubscriptionsByUser(userId);
  return evaluateTripPlanAccess(
    { tripEntitlements: [], subscriptions },
    "__any__",
  );
}
