import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

function shouldSkipProxy(pathname: string) {
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

export async function proxy(request: NextRequest) {
  try {
    if (!request || !request.nextUrl) {
      console.error("[proxy] Invalid request object");
      return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname ?? "";

    if (shouldSkipProxy(pathname) || pathname === "/favicon.ico") {
      return NextResponse.next();
    }

    const { supabase, supabaseResponse } = createClient(request);
    const authClient = supabase as {
      auth?: {
        getUser?: () => Promise<{
          error: { message: string; name?: string; status?: number } | null;
        }>;
      };
    };

    const hasAuthorizationHeader = Boolean(request.headers.get("authorization")?.trim());
    const hasSessionCookie = request
      .cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith("sb-"));

    if (hasAuthorizationHeader || hasSessionCookie) {
      const { error } = authClient.auth?.getUser
        ? await authClient.auth.getUser()
        : { error: null };

      if (error) {
        console.error("[proxy] supabase.auth.getUser returned error", {
          message: error.message,
          name: error.name,
          status: (error as { status?: number }).status,
        });
      }
    }

    return supabaseResponse ?? NextResponse.next();
  } catch (error) {
    console.error("[proxy] Unhandled proxy failure", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\.[^/]+$).*)"],
};