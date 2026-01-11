import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let adminClient: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseAdmin() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient<any>(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false },
      },
    );
  }

  return adminClient;
}
