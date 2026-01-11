import { env } from "@/lib/env";
import { getCachedRates, saveRates } from "@/server/db";

const CACHE_TTL_HOURS = 12;

type ExchangeRateApiResponse = {
  result: "success" | "error";
  conversion_rates: Record<string, number>;
  base_code: string;
  time_next_update_utc?: string;
  "error-type"?: string;
};

async function fetchLiveRates(baseCurrency: string) {
  if (!env.EXCHANGE_RATE_API_KEY) {
    throw new Error("ExchangeRate API key missing");
  }
  const url = `https://v6.exchangerate-api.com/v6/${env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }
  const payload = (await response.json()) as ExchangeRateApiResponse;
  if (payload.result !== "success") {
    throw new Error(payload["error-type"] ?? "Exchange rate error");
  }
  return payload.conversion_rates;
}

function isCacheFresh(fetchedAt: string) {
  const fetchedTime = new Date(fetchedAt).getTime();
  if (Number.isNaN(fetchedTime)) {
    return false;
  }
  const ageMs = Date.now() - fetchedTime;
  const ttlMs = CACHE_TTL_HOURS * 60 * 60 * 1000;
  return ageMs < ttlMs;
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
) {
  if (fromCurrency === toCurrency) {
    return {
      amount,
      rate: 1,
    };
  }

  const baseCurrency = fromCurrency.toUpperCase();
  const targetCurrency = toCurrency.toUpperCase();

  const cached = getCachedRates(baseCurrency);
  let rates = cached?.rates;

  if (!rates || !cached || !isCacheFresh(cached.fetched_at)) {
    rates = await fetchLiveRates(baseCurrency);
    await saveRates(baseCurrency, rates, "ExchangeRate API");
  }

  const rate = rates?.[targetCurrency];
  if (!rate) {
    throw new Error(`Rate for ${targetCurrency} not available`);
  }

  return {
    amount: amount * rate,
    rate,
  };
}

