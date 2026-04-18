import { createBrowserClient } from "@supabase/ssr";
import { createNoopSupabaseClient, readSupabaseEnv, resolveSupabaseKey } from "@/lib/supabase-helpers";

export function createClient() {
  const env = readSupabaseEnv();
  const supabaseUrl = env.hasValidUrl ? env.url : "";
  const supabaseKey = resolveSupabaseKey({ env });

  if (!supabaseUrl || !supabaseKey) {
    return createNoopSupabaseClient("[utils/supabase/client]");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}