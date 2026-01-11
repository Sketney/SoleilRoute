import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type ExchangeRateRecord = {
  base_currency: string;
  rates: Record<string, number>;
  fetched_at: string;
  provider: string;
};

export async function getCachedRates(
  baseCurrency: string,
): Promise<ExchangeRateRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const record = db.exchange_rates.find(
      (entry) => entry.base_currency === baseCurrency.toUpperCase(),
    );
    return record ? { ...record } : null;
  }

  const { data, error } = await supabase
    .from("exchange_rates")
    .select("*")
    .eq("base_currency", baseCurrency.toUpperCase())
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { ...(data as ExchangeRateRecord) };
}

export async function saveRates(
  baseCurrency: string,
  rates: Record<string, number>,
  provider: string,
) {
  const upper = baseCurrency.toUpperCase();
  const payload: ExchangeRateRecord = {
    base_currency: upper,
    rates,
    fetched_at: new Date().toISOString(),
    provider,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const existingIndex = db.exchange_rates.findIndex(
        (entry) => entry.base_currency === upper,
      );
      if (existingIndex >= 0) {
        db.exchange_rates[existingIndex] = payload;
      } else {
        db.exchange_rates.push(payload);
      }
    });
    return;
  }

  await supabase.from("exchange_rates").upsert(payload, {
    onConflict: "base_currency",
  });
}
