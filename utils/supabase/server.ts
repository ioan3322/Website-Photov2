import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createNoopSupabaseClient, readSupabaseEnv, resolveSupabaseKey } from "@/lib/supabase-helpers";

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  try {
    const env = readSupabaseEnv();
    const supabaseUrl = env.hasValidUrl ? env.url : "";
    const supabaseKey = resolveSupabaseKey({ preferServiceRole: false, env });

    if (!supabaseUrl || !supabaseKey) {
      console.error("[supabase][server] Missing or invalid environment variables", {
        hasUrl: env.hasValidUrl,
        hasAnonKey: env.hasValidAnonKey,
      });

      return createNoopSupabaseClient("[supabase][server]");
    }

    const safeCookieStore = cookieStore ?? {
      getAll: () => [],
      setAll: () => undefined,
      set: () => undefined,
    };

    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          try {
            return safeCookieStore.getAll();
          } catch (error) {
            console.error("[supabase][server] cookieStore.getAll failed", error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            if (!Array.isArray(cookiesToSet)) {
              console.error("[supabase][server] cookies.setAll invalid payload", {
                type: typeof cookiesToSet,
              });
              return;
            }

            cookiesToSet.forEach(({ name, value, options }) => {
              if (!name || typeof value !== "string") {
                return;
              }

              try {
                safeCookieStore.set?.(name, value, options);
              } catch (error) {
                console.error("[supabase][server] cookieStore.set failed", error);
              }
            });
          } catch (error) {
            console.error("[supabase][server] cookies.setAll failed", error);
          }
        },
      },
    });
  } catch (error) {
    console.error("[supabase][server] Failed to initialize server client", error);
    return createNoopSupabaseClient("[supabase][server]");
  }
};
