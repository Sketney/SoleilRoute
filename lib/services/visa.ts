import rawVisaDataset from "@/visa_data_multicountry.json";
import rawVisaRemainingDataset from "@/visa_data_remaining.json";
import rawVisaRemainingDatasetTwo from "@/visa_data_remaining2.json";
import rawVisaPopular2026 from "@/visa_data_popular_2026.json";
import rawVisaCIS2026 from "@/visa_data_cis_2026.json";

export type VisaRequirement = {
  citizenship: string;
  destination: string;
  visaRequired: boolean;
  visaType: string;
  validity: string;
  processingTime: string;
  cost: number;
  currency: string;
  embassyUrl: string;
  notes?: string;
};

export type TravelInsights = {
  name: string;
  flagUrl?: string;
  region?: string;
  subregion?: string;
  capital?: string;
  currencies?: { code: string; name?: string; symbol?: string }[];
  languages?: string[];
  timezones?: string[];
  callingCodes?: string[];
};

type RawVisaEntry = VisaRequirement;

type TravelBriefingVisa = {
  required?: string | boolean;
  message?: string;
  duration?: string;
  length?: string;
};

type TravelBriefingResponse = {
  names?: {
    name?: string;
    iso2?: string;
    iso3?: string;
  };
  visa?: TravelBriefingVisa;
};

type RestCountriesResponse = {
  name?: {
    common?: string;
  };
  flags?: {
    svg?: string;
    png?: string;
  };
  region?: string;
  subregion?: string;
  capital?: string[];
  currencies?: Record<string, { name?: string; symbol?: string }>;
  languages?: Record<string, string>;
  timezones?: string[];
  idd?: {
    root?: string;
    suffixes?: string[];
  };
};

const baseVisaDataset: VisaRequirement[] = [
  {
    citizenship: "USA",
    destination: "Japan",
    visaRequired: false,
    visaType: "Visa Waiver",
    validity: "Up to 90 days",
    processingTime: "Instant on arrival",
    cost: 0,
    currency: "USD",
    embassyUrl: "https://www.mofa.go.jp/",
    notes: "Passport must be valid for the entire stay and include proof of onward travel.",
  },
  {
    citizenship: "India",
    destination: "Japan",
    visaRequired: true,
    visaType: "Tourist Visa",
    validity: "Up to 90 days",
    processingTime: "5-7 business days",
    cost: 38,
    currency: "USD",
    embassyUrl: "https://www.mofa.go.jp/",
  },
  {
    citizenship: "United Kingdom",
    destination: "Brazil",
    visaRequired: false,
    visaType: "Visa Waiver",
    validity: "Up to 90 days",
    processingTime: "Instant on arrival",
    cost: 0,
    currency: "GBP",
    embassyUrl: "https://www.gov.br/mre/pt-br",
  },
  {
    citizenship: "Canada",
    destination: "Australia",
    visaRequired: true,
    visaType: "ETA (Electronic Travel Authority)",
    validity: "Up to 90 days per visit",
    processingTime: "Instant approval in most cases",
    cost: 20,
    currency: "AUD",
    embassyUrl: "https://www.dfat.gov.au/",
    notes: "Submit ETA application at least 72 hours before departure.",
  },
  {
    citizenship: "Australia",
    destination: "United States",
    visaRequired: true,
    visaType: "ESTA",
    validity: "2 years, 90 days per entry",
    processingTime: "Instant to 72 hours",
    cost: 21,
    currency: "USD",
    embassyUrl: "https://travel.state.gov/",
  },
];

function normalizeText(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u2212/g, "-")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const countryAliases: Record<string, string> = {
  usa: "United States",
  "u.s.": "United States",
  "u.s.a.": "United States",
  us: "United States",
  "united states of america": "United States",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  uae: "United Arab Emirates",
  "russian federation": "Russia",
  "czech republic": "Czechia",
  "south korea": "Korea, South",
  "north korea": "Korea, North",
  "ivory coast": "Cote d'Ivoire",
  "cape verde": "Cabo Verde",
  "viet nam": "Viet Nam",
  "laos": "Lao People's Democratic Republic",
  "myanmar (burma)": "Myanmar",
  "bolivia": "Bolivia",
  "tanzania": "Tanzania",
  "syria": "Syrian Arab Republic",
  "brunei": "Brunei Darussalam",
  "macedonia": "North Macedonia",
  "cabo verde": "Cabo Verde",
  "indonesia (bali)": "Indonesia",
};

const minorWords = new Set(["and", "or", "of", "the", "la", "de", "da"]);

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word, index) => {
      const needsLower = index > 0 && minorWords.has(word);
      const parts = word.split("-").map((part) => {
        if (!part) return part;
        if (needsLower) return part;
        return part[0].toUpperCase() + part.slice(1);
      });
      return parts.join("-");
    })
    .join(" ");
}

function normalizeCountryName(value: string) {
  const raw = normalizeText(value);
  const key = raw.toLowerCase();
  if (countryAliases[key]) {
    return countryAliases[key];
  }
  if (!raw) {
    return raw;
  }
  if (raw === raw.toLowerCase()) {
    return titleCase(raw);
  }
  return raw;
}

function normalizeEntry(entry: RawVisaEntry): VisaRequirement {
  const rawCost =
    typeof entry.cost === "number" ? entry.cost : Number(entry.cost ?? 0);
  const cost = Number.isFinite(rawCost) ? rawCost : 0;
  const currency = normalizeText(entry.currency ?? "");
  const notes = entry.notes ? normalizeText(entry.notes) : undefined;

  return {
    citizenship: normalizeCountryName(entry.citizenship ?? ""),
    destination: normalizeCountryName(entry.destination ?? ""),
    visaRequired: Boolean(entry.visaRequired),
    visaType: normalizeText(entry.visaType ?? ""),
    validity: normalizeText(entry.validity ?? ""),
    processingTime: normalizeText(entry.processingTime ?? ""),
    cost,
    currency: currency || (cost > 0 ? "USD" : ""),
    embassyUrl: normalizeText(entry.embassyUrl ?? ""),
    notes,
  };
}

function normalizeKey(value: string) {
  return normalizeText(value).toLowerCase();
}

function makeKey(citizenship: string, destination: string) {
  return `${normalizeKey(citizenship)}::${normalizeKey(destination)}`;
}

function buildVisaDataset() {
  const map = new Map<string, VisaRequirement>();
  const rawEntries = [
    ...(rawVisaPopular2026 as RawVisaEntry[]),
    ...(rawVisaCIS2026 as RawVisaEntry[]),
    ...(rawVisaDataset as RawVisaEntry[]),
    ...(rawVisaRemainingDataset as RawVisaEntry[]),
    ...(rawVisaRemainingDatasetTwo as RawVisaEntry[]),
  ];

  for (const entry of rawEntries) {
    const normalized = normalizeEntry(entry);
    map.set(makeKey(normalized.citizenship, normalized.destination), normalized);
  }

  for (const entry of baseVisaDataset) {
    const normalized = normalizeEntry(entry);
    const key = makeKey(normalized.citizenship, normalized.destination);
    if (!map.has(key)) {
      map.set(key, normalized);
    }
  }

  return {
    list: Array.from(map.values()),
    index: map,
  };
}

const { list: visaDataset, index: visaDatasetIndex } = buildVisaDataset();

type TravelBriefingStatus = "ok" | "not_found" | "error";

const travelBriefingCache = new Map<
  string,
  { expiresAt: number; data: TravelBriefingResponse | null; status: TravelBriefingStatus }
>();
const travelBriefingTtlMs = 12 * 60 * 60 * 1000;
const travelBriefingTimeoutMs = 8000;
const travelBriefingMaxAttempts = 1;
const travelBriefingRetryDelayMs = 400;

type RestCountriesStatus = "ok" | "not_found" | "error";

const restCountriesCache = new Map<
  string,
  { expiresAt: number; data: TravelInsights | null; status: RestCountriesStatus }
>();
const restCountriesTtlMs = 24 * 60 * 60 * 1000;
const restCountriesTimeoutMs = 7000;
const insightsSoftTimeoutMs = 2000;
const visaLookupTimeoutMs = 6000;

function isTravelBriefingEnabled() {
  if (process.env.NODE_ENV === "test") {
    return false;
  }
  const toggle = process.env.TRAVELBRIEFING_ENABLED;
  if (!toggle) {
    return true;
  }
  return !["0", "false", "no"].includes(toggle.toLowerCase());
}

function normalizeRestCountriesEntry(entry: RestCountriesResponse): TravelInsights {
  const currencies = entry.currencies
    ? Object.entries(entry.currencies).map(([code, details]) => ({
        code: normalizeText(code),
        name: details?.name ? normalizeText(details.name) : undefined,
        symbol: details?.symbol ? normalizeText(details.symbol) : undefined,
      }))
    : undefined;
  const languages = entry.languages
    ? Object.values(entry.languages).map((language) => normalizeText(language))
    : undefined;
  const timezones = entry.timezones
    ? entry.timezones.map((zone) => normalizeText(zone))
    : undefined;
  const callingCodes = entry.idd?.root
    ? (entry.idd.suffixes ?? [""]).map((suffix) =>
        normalizeText(`${entry.idd?.root ?? ""}${suffix}`),
      )
    : undefined;

  return {
    name: normalizeText(entry.name?.common ?? ""),
    flagUrl: normalizeText(entry.flags?.svg ?? entry.flags?.png ?? ""),
    region: entry.region ? normalizeText(entry.region) : undefined,
    subregion: entry.subregion ? normalizeText(entry.subregion) : undefined,
    capital: entry.capital?.length
      ? normalizeText(entry.capital.join(", "))
      : undefined,
    currencies,
    languages,
    timezones,
    callingCodes,
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T) {
  if (timeoutMs <= 0) {
    return promise.catch(() => fallback);
  }

  return new Promise<T>((resolve) => {
    const timeoutId = setTimeout(() => resolve(fallback), timeoutMs);
    promise
      .then((value) => resolve(value))
      .catch(() => resolve(fallback))
      .finally(() => clearTimeout(timeoutId));
  });
}

async function fetchCountryInsights(
  country: string,
): Promise<{ data: TravelInsights | null; status: RestCountriesStatus }> {
  const normalizedCountry = normalizeCountryName(country);
  const key = normalizeKey(normalizedCountry);
  const cached = restCountriesCache.get(key);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return { data: cached.data, status: cached.status };
  }

  const fields =
    "name,flags,region,subregion,capital,currencies,languages,timezones,idd";
  const baseUrl = "https://restcountries.com/v3.1/name";
  const fullTextUrl = `${baseUrl}/${encodeURIComponent(
    normalizedCountry,
  )}?fullText=true&fields=${fields}`;
  const fuzzyUrl = `${baseUrl}/${encodeURIComponent(
    normalizedCountry,
  )}?fields=${fields}`;

  const fetchEntry = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      restCountriesTimeoutMs,
    );
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) {
        return { ok: false, status: response.status, data: null };
      }
      const data = (await response.json()) as RestCountriesResponse[];
      return { ok: true, status: response.status, data };
    } catch {
      return { ok: false, status: 0, data: null };
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    let result = await fetchEntry(fullTextUrl);
    if (!result.ok && result.status === 404) {
      result = await fetchEntry(fuzzyUrl);
    }
    if (!result.ok || !result.data?.length) {
      const status: RestCountriesStatus =
        result.status === 404 ? "not_found" : "error";
      restCountriesCache.set(key, {
        expiresAt: now + restCountriesTtlMs,
        data: null,
        status,
      });
      return { data: null, status };
    }

    const insight = normalizeRestCountriesEntry(result.data[0]);
    if (!insight.name) {
      restCountriesCache.set(key, {
        expiresAt: now + restCountriesTtlMs,
        data: null,
        status: "not_found",
      });
      return { data: null, status: "not_found" };
    }

    restCountriesCache.set(key, {
      expiresAt: now + restCountriesTtlMs,
      data: insight,
      status: "ok",
    });
    return { data: insight, status: "ok" };
  } catch {
    restCountriesCache.set(key, {
      expiresAt: now + restCountriesTtlMs,
      data: null,
      status: "error",
    });
    return { data: null, status: "error" };
  }
}

function parseVisaRequired(value?: string | boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = normalizeText(value).toLowerCase();
    if (["yes", "true", "required", "visa required"].includes(normalized)) {
      return true;
    }
    if (["no", "false", "not required", "visa not required"].includes(normalized)) {
      return false;
    }
  }
  return false;
}

async function fetchTravelBriefing(
  destination: string,
): Promise<{ data: TravelBriefingResponse | null; status: TravelBriefingStatus }> {
  if (!isTravelBriefingEnabled()) {
    return { data: null, status: "error" };
  }

  const normalizedDestination = normalizeCountryName(destination);
  const key = normalizeKey(normalizedDestination);
  const cached = travelBriefingCache.get(key);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return { data: cached.data, status: cached.status };
  }

  for (let attempt = 0; attempt < travelBriefingMaxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      travelBriefingTimeoutMs,
    );
    try {
      const response = await fetch(
        `https://travelbriefing.org/${encodeURIComponent(
          normalizedDestination,
        )}?format=json`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "User-Agent": "SoleilRoute/1.0",
          },
        },
      );

      if (!response.ok) {
        const status = response.status === 404 ? "not_found" : "error";
        travelBriefingCache.set(key, {
          expiresAt: now + travelBriefingTtlMs,
          data: null,
          status,
        });
        return { data: null, status };
      }

      const data = (await response.json()) as TravelBriefingResponse;
      const status: TravelBriefingStatus = data?.visa ? "ok" : "not_found";
      travelBriefingCache.set(key, {
        expiresAt: now + travelBriefingTtlMs,
        data,
        status,
      });
      return { data, status };
    } catch {
      if (attempt < travelBriefingMaxAttempts - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, travelBriefingRetryDelayMs * (attempt + 1)),
        );
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  travelBriefingCache.set(key, {
    expiresAt: now + travelBriefingTtlMs,
    data: null,
    status: "error",
  });
  return { data: null, status: "error" };
}

function normalizeTravelBriefingRequirement(
  citizenship: string,
  destination: string,
  data: TravelBriefingResponse,
): VisaRequirement {
  const visa = data.visa ?? {};
  const visaRequired = parseVisaRequired(visa.required);
  const duration = normalizeText(visa.duration ?? visa.length ?? "");
  const message = normalizeText(visa.message ?? "");
  const noteParts = message ? [message] : [];
  const normalizedCitizenship = normalizeCountryName(citizenship);
  const normalizedDestination = normalizeCountryName(destination);

  return {
    citizenship: normalizedCitizenship,
    destination: normalizedDestination,
    visaRequired,
    visaType: visaRequired ? "Visa required" : "Visa not required",
    validity: duration || "See notes",
    processingTime: "See notes",
    cost: 0,
    currency: "USD",
    embassyUrl: "",
    notes: noteParts.length ? noteParts.join(" ") : undefined,
  };
}

export async function getVisaRequirementWithSource(
  citizenship: string,
  destination: string,
) {
  const normalizedCitizenship = normalizeCountryName(citizenship);
  const normalizedDestination = normalizeCountryName(destination);
  const cached =
    visaDatasetIndex.get(
      makeKey(normalizedCitizenship, normalizedDestination),
    ) ?? null;
  const emptyTravelBriefing = { data: null, status: "error" as const };
  const emptyInsights = { data: null, status: "error" as const };
  const insightsPromise = fetchCountryInsights(normalizedDestination);
  const travelBriefingPromise = fetchTravelBriefing(normalizedDestination);
  const [travelBriefing, insightsLookup] = await Promise.all([
    withTimeout(travelBriefingPromise, visaLookupTimeoutMs, emptyTravelBriefing),
    withTimeout(insightsPromise, insightsSoftTimeoutMs, emptyInsights),
  ]);
  if (travelBriefing.data?.visa) {
    return {
      requirement: normalizeTravelBriefingRequirement(
        normalizedCitizenship,
        normalizedDestination,
        travelBriefing.data,
      ),
      source: "TravelBriefing",
      fallback: false,
      insights: insightsLookup.data,
    };
  }

  if (cached) {
    const source =
      travelBriefing.status === "error"
        ? "TravelBriefing unavailable (using cache)"
        : "TravelBriefing has no data (using cache)";
    return {
      requirement: cached,
      source,
      fallback: true,
      insights: insightsLookup.data,
    };
  }

  return {
    requirement: null,
    source:
      travelBriefing.status === "error"
        ? "TravelBriefing unavailable"
        : "TravelBriefing has no data for this destination",
    fallback: true,
    insights: insightsLookup.data,
  };
}

export async function getVisaRequirement(
  citizenship: string,
  destination: string,
): Promise<VisaRequirement | null> {
  const { requirement } = await getVisaRequirementWithSource(
    citizenship,
    destination,
  );
  return requirement;
}

export function listVisaDataset() {
  return visaDataset;
}
