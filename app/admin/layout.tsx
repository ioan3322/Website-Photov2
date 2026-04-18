import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  let isAuthenticated = false;

  try {
    isAuthenticated = Boolean(verifyAdminSessionToken(token));
  } catch {
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    redirect("/admin-auth");
  }

  return <>{children}</>;
}
