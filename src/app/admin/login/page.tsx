import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";
import {
  ADMIN_COOKIE,
  isAdminConfigured,
  verifySessionToken,
} from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const jar = await cookies();
  if (verifySessionToken(jar.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }
  return <AdminLoginForm configured={isAdminConfigured()} />;
}
