import { cookies } from "next/headers";
import { localeCookie, resolveLocale } from "@/lib/i18n";

export async function getRequestLocale() {
  const cookieStore = await cookies();
  const value = cookieStore.get(localeCookie)?.value;
  return resolveLocale(value);
}
