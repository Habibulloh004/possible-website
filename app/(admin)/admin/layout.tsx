import { ReactNode } from "react";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./admin-layout-client";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  // Allow access to login page without authentication
  // All other routes require authentication
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  // This layout wraps all /admin routes
  // We'll check auth in individual pages except login

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
