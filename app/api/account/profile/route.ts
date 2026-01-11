import path from "path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import { getUserById, updateUserEmail, updateUserProfile } from "@/server/db";
import { savePostImage } from "@/lib/moderation/validation";

const profileSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().max(60).optional(),
  avatarUrl: z.string().url().or(z.literal("")).optional(),
});

const maxAvatarBytes = 2 * 1024 * 1024;

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");
  let payload: z.infer<typeof profileSchema> = {};
  let avatarFile: File | null = null;

  if (isMultipart) {
    const formData = await request.formData();
    payload = {
      email: String(formData.get("email") ?? "").trim() || undefined,
      displayName:
        String(formData.get("displayName") ?? "").trim() || undefined,
      avatarUrl:
        typeof formData.get("avatarUrl") === "string"
          ? String(formData.get("avatarUrl")).trim()
          : undefined,
    };
    const fileValue = formData.get("avatar");
    avatarFile = fileValue instanceof File ? fileValue : null;
  } else {
    const body = await request.json().catch(() => null);
    const parsedBody = profileSchema.safeParse(body);
    if (parsedBody.success) {
      payload = parsedBody.data;
    } else {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  }

  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updates: { email?: string; displayName?: string; avatarUrl?: string } =
    {};

  if (parsed.data.email) {
    const normalizedEmail = parsed.data.email.toLowerCase();
    if (user.email !== normalizedEmail) {
      updates.email = normalizedEmail;
    }
  }

  try {
    if (updates.email) {
      await updateUserEmail(user.id, updates.email);
    }

    let avatarUrl = parsed.data.avatarUrl;
    if (avatarFile && avatarFile.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
      const fileKey = `${user.id}-${Date.now()}`;
      const saved = await savePostImage(
        avatarFile,
        uploadsDir,
        fileKey,
        maxAvatarBytes,
        "/uploads/avatars",
      );
      if (!saved.ok) {
        return NextResponse.json({ error: saved.error }, { status: 400 });
      }
      avatarUrl = saved.url;
    }

    if (
      parsed.data.displayName !== undefined ||
      avatarUrl !== undefined
    ) {
      await updateUserProfile(user.id, {
        displayName: parsed.data.displayName ?? user.display_name ?? "",
        avatarUrl: avatarUrl ?? user.avatar_url ?? "",
      });
    }

    const refreshed = await getUserById(user.id);
    return NextResponse.json({
      email: refreshed?.email ?? user.email,
      displayName: refreshed?.display_name ?? "",
      avatarUrl: refreshed?.avatar_url ?? "",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    throw error;
  }
}
