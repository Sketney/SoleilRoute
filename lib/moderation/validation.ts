import path from "path";
import fs from "fs";
import { containsProhibitedLanguage } from "@/lib/moderation/bad-words";
import { communityTags, type CommunityTag } from "@/lib/moderation/tags";

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/jpg", ".jpg"],
  ["image/pjpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

const mapHosts = new Set([
  "maps.google.com",
  "www.google.com",
  "maps.app.goo.gl",
  "goo.gl",
  "openstreetmap.org",
  "www.openstreetmap.org",
  "yandex.ru",
  "maps.yandex.ru",
  "yandex.com",
  "maps.yandex.com",
]);

export function validatePostText(text: string) {
  const trimmed = text.trim();
  if (trimmed.length < 10) {
    return { ok: false, error: "TEXT_TOO_SHORT" };
  }
  if (trimmed.length > 1000) {
    return { ok: false, error: "TEXT_TOO_LONG" };
  }
  if (containsProhibitedLanguage(trimmed)) {
    return { ok: false, error: "TEXT_PROHIBITED" };
  }
  return { ok: true, value: trimmed };
}

export function validateCommentText(text: string) {
  const trimmed = text.trim();
  if (trimmed.length < 3) {
    return { ok: false, error: "COMMENT_TOO_SHORT" };
  }
  if (trimmed.length > 300) {
    return { ok: false, error: "COMMENT_TOO_LONG" };
  }
  if (containsProhibitedLanguage(trimmed)) {
    return { ok: false, error: "COMMENT_PROHIBITED" };
  }
  return { ok: true, value: trimmed };
}

export function validateTag(tag: string) {
  if (communityTags.includes(tag as CommunityTag)) {
    return { ok: true, value: tag as CommunityTag };
  }
  return { ok: false, error: "TAG_INVALID" };
}

export function validateMapUrl(raw?: string | null) {
  const value = raw?.trim();
  if (!value) {
    return { ok: true, value: "" };
  }
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { ok: false, error: "MAP_URL_INVALID" };
    }
    if (![...mapHosts].some((host) => url.host.includes(host))) {
      return { ok: false, error: "MAP_URL_INVALID" };
    }
    return { ok: true, value: url.toString() };
  } catch {
    return { ok: false, error: "MAP_URL_INVALID" };
  }
}

export async function savePostImage(
  file: File,
  destinationDir: string,
  filenameBase: string,
  maxSizeBytes: number,
  publicPath = "/uploads/community",
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (file.size > maxSizeBytes) {
    return { ok: false, error: "IMAGE_TOO_LARGE" };
  }
  const extension =
    allowedImageTypes.get(file.type) ??
    path.extname(file.name).toLowerCase();
  if (!allowedImageTypes.has(file.type)) {
    return { ok: false, error: "IMAGE_TYPE_INVALID" };
  }

  fs.mkdirSync(destinationDir, { recursive: true });
  const filename = `${filenameBase}${extension}`;
  const filePath = path.join(destinationDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return { ok: true, url: `${publicPath}/${filename}` };
}
