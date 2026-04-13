import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Middleware must never crash in Edge runtime.
  try {
    if (!request || !request.nextUrl) {
      console.error("[middleware] Invalid request object");
      return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // Defensive skip: avoid touching static/internal routes and prevent accidental loops.
    if (
      pathname.startsWith("/_next") ||
      pathname === "/favicon.ico" ||
      /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt)$/i.test(pathname)
    ) {
      return NextResponse.next();
    }

    const { supabase, supabaseResponse } = createClient(request);

    if (!supabase) {
      // Env vars missing or client init failed; continue safely.
      return supabaseResponse ?? NextResponse.next();
    }

    try {
      // Refresh auth session cookie if present; do not fail request if auth check errors.
      const { error } = await supabase.auth.getUser();
      if (error) {
        console.error("[middleware] supabase.auth.getUser returned error", {
          message: error.message,
          name: error.name,
          status: (error as { status?: number }).status,
        });
      }
    } catch (error) {
      console.error("[middleware] supabase.auth.getUser threw", error);
    }

    return supabaseResponse ?? NextResponse.next();
  } catch (error) {
    console.error("[middleware] Unhandled middleware failure", error);
    // Last-resort fallback to guarantee response in production.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
