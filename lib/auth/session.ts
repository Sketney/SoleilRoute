import { cache } from "react";
import { cookies } from "next/headers";
import { getSessionWithUser } from "@/server/db";
import { isAdminEmail } from "@/lib/auth/roles";

export type AppSession = {
  user: {
    id: string;
    email: string;
    is_moderator: boolean;
    is_admin: boolean;
    display_name: string;
    avatar_url: string;
  };
};

export const getServerSession = cache(async (): Promise<AppSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null;
  }

  const session = await getSessionWithUser(token);

  if (!session) {
    return null;
  }

  const isAdmin = isAdminEmail(session.user.email);
  const isModerator = isAdmin || Boolean(session.user.is_moderator);

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      is_moderator: isModerator,
      is_admin: isAdmin,
      display_name: session.user.display_name ?? "",
      avatar_url: session.user.avatar_url ?? "",
    },
  };
});
