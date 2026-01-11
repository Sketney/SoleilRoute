import { readDatabase, updateDatabase } from "@/server/db/client";

export type ExchangeRateRecord = {
  base_currency: string;
  rates: Record<string, number>;
  fetched_at: string;
  provider: string;
};

export function getCachedRates(baseCurrency: string): ExchangeRateRecord | null {
  const db = readDatabase();
  const record = db.exchange_rates.find(
    (entry) => entry.base_currency === baseCurrency.toUpperCase(),
  );
  return record ? { ...record } : null;
}

export function saveRates(
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
}
