const adminEmails = new Set(
  ["seysreyn@gmail.com", "test@example.com"].map((email) =>
    email.toLowerCase(),
  ),
);

type RoleUser = {
  email?: string | null;
  is_moderator?: boolean | null;
};

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }
  return adminEmails.has(email.toLowerCase());
}

export function isModerator(user?: RoleUser | null) {
  if (!user) {
    return false;
  }
  return isAdminEmail(user.email ?? null) || Boolean(user.is_moderator);
}

