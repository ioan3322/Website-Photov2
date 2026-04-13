import { createBrowserClient } from "@supabase/ssr";
import { createNoopSupabaseClient, readSupabaseEnv, resolveSupabaseKey } from "@/lib/supabase-helpers";

export const createClient = () => {
  try {
    const env = readSupabaseEnv();
    const supabaseUrl = env.hasValidUrl ? env.url : "";
    const supabaseKey = resolveSupabaseKey({ env });

    if (!supabaseUrl || !supabaseKey) {
      console.error("[supabase][client] Missing or invalid environment variables", {
        hasUrl: env.hasValidUrl,
        hasAnonKey: env.hasValidAnonKey,
      });

      return createNoopSupabaseClient("[supabase][client]");
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("[supabase][client] Failed to initialize browser client", error);
    return createNoopSupabaseClient("[supabase][client]");
  }
};
