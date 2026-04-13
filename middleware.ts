import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

function shouldSkipMiddleware(pathname: string) {
  if (!pathname || typeof pathname !== "string") {
    return true;
  }

  if (pathname.startsWith("/_next/")) {
    return true;
  }

  if (pathname.startsWith("/api/")) {
    return true;
  }

  return /\.[a-z0-9]+$/i.test(pathname);
}

export async function middleware(request: NextRequest) {
  try {
    if (!request || !request.nextUrl) {
      console.error("[middleware] Invalid request object");
      return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname ?? "";

    if (shouldSkipMiddleware(pathname) || pathname === "/favicon.ico") {
      return NextResponse.next();
    }

    const { supabase, supabaseResponse } = createClient(request);

    try {
      const authClient = supabase as {
        auth?: {
          getUser?: () => Promise<{
            error: { message: string; name?: string; status?: number } | null;
          }>;
        };
      };

      if (authClient.auth?.getUser) {
        const { error } = await authClient.auth.getUser();

        if (error) {
          console.error("[middleware] supabase.auth.getUser returned error", {
            message: error.message,
            name: error.name,
            status: (error as { status?: number }).status,
          });
        }
      }
    } catch (error) {
      console.error("[middleware] supabase.auth.getUser threw", error);
    }

    return supabaseResponse ?? NextResponse.next();
  } catch (error) {
    console.error("[middleware] Unhandled middleware failure", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\.[^/]+$).*)"],
};
