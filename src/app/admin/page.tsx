import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";
import {
  ADMIN_COOKIE,
  isAdminConfigured,
  listMedia,
  readCms,
  verifySessionToken,
} from "@/lib/cms/store";
import { readOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    redirect("/admin/login");
  }
  const jar = await cookies();
  const ok = verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin/login");

  const [content, media, orders] = await Promise.all([
    readCms(),
    listMedia(),
    readOrders(),
  ]);

  return (
    <AdminDashboard
      initialContent={content}
      initialMedia={media}
      initialOrders={orders}
    />
  );
}
