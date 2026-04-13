import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (request: NextRequest) => {
  // Always start with a safe fallback response and never throw from this helper.
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("[middleware][supabase] Missing env vars", {
        hasUrl: Boolean(supabaseUrl),
        hasPublishableKey: Boolean(supabaseKey),
      });
      return { supabase: null, supabaseResponse };
    }

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
              request.cookies.set(name, value);
            });

            supabaseResponse = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) => {
              if (!name || typeof value !== "string") {
                return;
              }
              supabaseResponse.cookies.set(name, value, options);
            });
          } catch (error) {
            console.error("[middleware][supabase] cookies.setAll failed", error);
          }
        },
      },
    });

    return { supabase, supabaseResponse };
  } catch (error) {
    console.error("[middleware][supabase] createClient failed", error);
    return { supabase: null, supabaseResponse };
  }
};
