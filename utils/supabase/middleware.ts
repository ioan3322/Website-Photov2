import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { createNoopSupabaseClient, readSupabaseEnv, resolveSupabaseKey } from "@/lib/supabase-helpers";

export const createClient = (request: NextRequest) => {
  const fallbackResponse = NextResponse.next({
    request: {
      headers: request?.headers ?? new Headers(),
    },
  });

  try {
    if (!request || !request.headers || !request.cookies) {
      console.error("[middleware][supabase] Invalid request object");
      return {
        supabase: createNoopSupabaseClient("[middleware][supabase]"),
        supabaseResponse: fallbackResponse,
      };
    }

    const env = readSupabaseEnv();
    const supabaseUrl = env.hasValidUrl ? env.url : "";
    const supabaseKey = resolveSupabaseKey({ preferServiceRole: false, env });

    if (!supabaseUrl || !supabaseKey) {
      console.error("[middleware][supabase] Missing or invalid environment variables", {
        hasUrl: env.hasValidUrl,
        hasAnonKey: env.hasValidAnonKey,
      });

      return {
        supabase: createNoopSupabaseClient("[middleware][supabase]"),
        supabaseResponse: fallbackResponse,
      };
    }

    let supabaseResponse = fallbackResponse;
    const authorizationHeader = request.headers.get("authorization")?.trim();

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          try {
            return request.cookies.getAll();
          } catch (error) {
            console.error("[middleware][supabase] cookies.getAll failed", error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            if (!Array.isArray(cookiesToSet)) {
              console.error("[middleware][supabase] cookies.setAll invalid payload", {
                type: typeof cookiesToSet,
              });
              return;
            }

            cookiesToSet.forEach(({ name, value }) => {
              if (!name || typeof value !== "string") {
                return;
              }

              try {
                request.cookies.set(name, value);
              } catch (cookieError) {
                console.error("[middleware][supabase] request.cookies.set failed", cookieError);
              }
            });

            supabaseResponse = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) => {
              if (!name || typeof value !== "string") {
                return;
              }

              try {
                supabaseResponse.cookies.set(name, value, options);
              } catch (cookieError) {
                console.error("[middleware][supabase] response.cookies.set failed", cookieError);
              }
            });
          } catch (error) {
            console.error("[middleware][supabase] cookies.setAll failed", error);
          }
        },
      },
      ...(authorizationHeader
        ? {
            global: {
              headers: {
                Authorization: authorizationHeader,
              },
            },
          }
        : {}),
    });

    return { supabase, supabaseResponse };
  } catch (error) {
    console.error("[middleware][supabase] createClient failed", error);
    return {
      supabase: createNoopSupabaseClient("[middleware][supabase]"),
      supabaseResponse: fallbackResponse,
    };
  }
};
