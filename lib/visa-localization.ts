type UnitKey = "day" | "month" | "year" | "hour" | "week";

type LocaleConfig = {
  na: string;
  visaExemption: string;
  visaFree: string;
  visaWaiver: string;
  visaOnArrival: string;
  visaRequired: string;
  onArrival: string;
  sameDay: string;
  immediate: string;
  instant: string;
  extendable: string;
  upTo: string;
  within: string;
  units: Record<UnitKey, { singular: string; plural: string; few?: string }>;
  eVisa?: string;
};

const localeConfigs: Record<string, LocaleConfig> = {
  ru: {
    na: "Нет данных",
    visaExemption: "Безвизовый въезд",
    visaFree: "Безвизовый въезд",
    visaWaiver: "Безвизовый режим",
    visaOnArrival: "Виза по прибытии",
    visaRequired: "Требуется виза",
    onArrival: "По прибытии",
    sameDay: "В тот же день",
    immediate: "Мгновенно",
    instant: "Мгновенно",
    extendable: "с возможностью продления",
    upTo: "До",
    within: "В течение",
    units: {
      day: { singular: "день", few: "дня", plural: "дней" },
      month: { singular: "месяц", few: "месяца", plural: "месяцев" },
      year: { singular: "год", few: "года", plural: "лет" },
      hour: { singular: "час", few: "часа", plural: "часов" },
      week: { singular: "неделя", few: "недели", plural: "недель" },
    },
    eVisa: "e-виза",
  },
  fr: {
    na: "Non disponible",
    visaExemption: "Exemption de visa",
    visaFree: "Sans visa",
    visaWaiver: "Dispense de visa",
    visaOnArrival: "Visa à l'arrivée",
    visaRequired: "Visa requis",
    onArrival: "À l'arrivée",
    sameDay: "Le jour même",
    immediate: "Immédiat",
    instant: "Immédiat",
    extendable: "prolongeable",
    upTo: "Jusqu'à",
    within: "Dans les",
    units: {
      day: { singular: "jour", plural: "jours" },
      month: { singular: "mois", plural: "mois" },
      year: { singular: "an", plural: "ans" },
      hour: { singular: "heure", plural: "heures" },
      week: { singular: "semaine", plural: "semaines" },
    },
    eVisa: "e-visa",
  },
  de: {
    na: "Nicht verfügbar",
    visaExemption: "Visumbefreiung",
    visaFree: "Visumfrei",
    visaWaiver: "Visumfreiheit",
    visaOnArrival: "Visum bei Ankunft",
    visaRequired: "Visum erforderlich",
    onArrival: "Bei Ankunft",
    sameDay: "Am selben Tag",
    immediate: "Sofort",
    instant: "Sofort",
    extendable: "verlängerbar",
    upTo: "Bis zu",
    within: "Innerhalb",
    units: {
      day: { singular: "Tag", plural: "Tage" },
      month: { singular: "Monat", plural: "Monate" },
      year: { singular: "Jahr", plural: "Jahre" },
      hour: { singular: "Stunde", plural: "Stunden" },
      week: { singular: "Woche", plural: "Wochen" },
    },
    eVisa: "e-Visum",
  },
  es: {
    na: "No disponible",
    visaExemption: "Exención de visado",
    visaFree: "Sin visa",
    visaWaiver: "Exención de visa",
    visaOnArrival: "Visado a la llegada",
    visaRequired: "Visa requerida",
    onArrival: "A la llegada",
    sameDay: "El mismo día",
    immediate: "Inmediato",
    instant: "Inmediato",
    extendable: "prorrogable",
    upTo: "Hasta",
    within: "Dentro de",
    units: {
      day: { singular: "día", plural: "días" },
      month: { singular: "mes", plural: "meses" },
      year: { singular: "año", plural: "años" },
      hour: { singular: "hora", plural: "horas" },
      week: { singular: "semana", plural: "semanas" },
    },
    eVisa: "e-visa",
  },
};

const unitAliases: Record<string, UnitKey> = {
  day: "day",
  days: "day",
  month: "month",
  months: "month",
  year: "year",
  years: "year",
  hour: "hour",
  hours: "hour",
  week: "week",
  weeks: "week",
};

function hasCyrillic(value: string) {
  return /[А-Яа-яЁё]/.test(value);
}

function formatUnit(locale: string, unit: string, countRaw: string) {
  const config = localeConfigs[locale];
  if (!config) {
    return unit;
  }
  const count = Number(countRaw);
  const key = unitAliases[unit.toLowerCase()];
  if (!key || Number.isNaN(count)) {
    return unit;
  }
  const forms = config.units[key];
  if (locale === "ru" && forms.few) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return forms.singular;
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return forms.few;
    }
    return forms.plural;
  }
  return count === 1 ? forms.singular : forms.plural;
}

export function localizeVisaValue(
  value: string | null | undefined,
  locale: string,
) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed || locale === "en") {
    return trimmed;
  }
  if (locale === "ru" && hasCyrillic(trimmed)) {
    return trimmed;
  }
  const config = localeConfigs[locale];
  if (!config) {
    return trimmed;
  }
  let output = trimmed;
  output = output.replace(/\bN\/A\b/gi, config.na);
  output = output.replace(/\bVisa Exemption\b/gi, config.visaExemption);
  output = output.replace(/\bVisa[- ]?free\b/gi, config.visaFree);
  output = output.replace(/\bVisa Waiver\b/gi, config.visaWaiver);
  output = output.replace(/\bVisa on Arrival\b/gi, config.visaOnArrival);
  output = output.replace(/\bVisa required\b/gi, config.visaRequired);
  output = output.replace(/\bOn arrival\b/gi, config.onArrival);
  output = output.replace(/\bSame day\b/gi, config.sameDay);
  output = output.replace(/\bImmediate\b/gi, config.immediate);
  output = output.replace(/\bInstant\b/gi, config.instant);
  output = output.replace(/\bextendable\b/gi, config.extendable);
  if (config.eVisa) {
    output = output.replace(/\be-?visa\b/gi, config.eVisa);
  }
  output = output.replace(
    /\bUp to (\d+)\s*(hours?|days?|weeks?|months?|years?)\b/gi,
    (_, count, unit) =>
      `${config.upTo} ${count} ${formatUnit(locale, unit, count)}`,
  );
  output = output.replace(
    /\bWithin (\d+)\s*(hours?|days?|weeks?|months?|years?)\b/gi,
    (_, count, unit) =>
      `${config.within} ${count} ${formatUnit(locale, unit, count)}`,
  );
  output = output.replace(
    /\b(\d+)\s*(hours?|days?|weeks?|months?|years?)\b/gi,
    (_, count, unit) => `${count} ${formatUnit(locale, unit, count)}`,
  );
  return output;
}
