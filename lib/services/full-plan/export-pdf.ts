import type { TripPlanSnapshot } from "@/lib/services/full-plan/types";
import { formatCurrency } from "@/lib/utils";

const pageWidth = 595;
const pageHeight = 842;
const margin = 48;
const lineHeight = 14;
const maxCharsPerLine = 88;
const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

function ascii(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfText(value: string) {
  return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapLine(line: string) {
  const cleaned = ascii(line);
  if (cleaned.length <= maxCharsPerLine) {
    return [cleaned];
  }

  const words = cleaned.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function formatDate(value: string | null) {
  if (!value) {
    return "n/a";
  }
  return new Date(value).toISOString().slice(0, 10);
}

function buildTextLines(plan: TripPlanSnapshot) {
  const lines: string[] = [
    "Full trip plan",
    `${plan.trip.name} - ${plan.trip.destination}`,
    `${formatDate(plan.trip.dates.start)} to ${formatDate(plan.trip.dates.end)}`,
    `Citizenship: ${plan.trip.citizenship}`,
    `Generated: ${formatDate(plan.generatedAt)} | Version: ${plan.version}`,
    "",
    "Visa",
    `Required: ${plan.visa.required === null ? "Unknown" : plan.visa.required ? "Yes" : "No"}`,
    `Type: ${plan.visa.type ?? "n/a"}`,
    `Validity: ${plan.visa.validity ?? "n/a"}`,
    `Processing: ${plan.visa.processingTime ?? "n/a"}`,
    `Passport validity: ${plan.visa.passportValidity ?? "n/a"}`,
    `Source: ${plan.visa.source}`,
  ];

  if (plan.visa.notes) {
    lines.push(`Notes: ${plan.visa.notes}`);
  }

  lines.push("", "Documents");
  plan.documents.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.title}${item.required ? " (required)" : ""} - ${item.description}`,
    );
  });

  lines.push("", "Timeline");
  plan.timeline.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${formatDate(item.dueDate)} - ${item.title} - ${item.description}`,
    );
  });

  lines.push("", "Budget");
  lines.push(`Total: ${formatCurrency(plan.budget.total, plan.budget.currency)}`);
  plan.budget.items.forEach((item) => {
    lines.push(
      `${String(item.category).replace("_", " ")}: ${formatCurrency(item.amount, item.currency)} (${item.confidence})`,
    );
  });

  lines.push("", "Sources");
  plan.sources.forEach((source) => {
    lines.push(
      `${source.label}: ${source.source} (${source.confidence})${source.checkedAt ? ` checked ${formatDate(source.checkedAt)}` : ""}`,
    );
  });

  lines.push("", "Disclaimer", plan.disclaimer);
  return lines.flatMap((line) => (line ? wrapLine(line) : [""]));
}

function paginate(lines: string[]) {
  const pages: string[][] = [];
  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pages.push(lines.slice(index, index + maxLinesPerPage));
  }
  return pages.length ? pages : [["Full trip plan"]];
}

function buildPageStream(lines: string[]) {
  const commands = [
    "BT",
    "/F1 10 Tf",
    `${margin} ${pageHeight - margin} Td`,
    `${lineHeight} TL`,
    ...lines.map((line) => `(${escapePdfText(line)}) Tj T*`),
    "ET",
  ];
  return commands.join("\n");
}

export function buildTripPlanPdf(plan: TripPlanSnapshot): Buffer {
  const pages = paginate(buildTextLines(plan));
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectId = 4 + pageIndex * 2;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    const stream = buildPageStream(pageLines);
    objects[pageObjectId - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
    objects[contentObjectId - 1] =
      `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`;
  });

  objects[1] =
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = Buffer.byteLength(pdf, "latin1");
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
}
