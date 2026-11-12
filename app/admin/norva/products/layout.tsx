import type { ReactNode } from "react";
import { requireAdminPage } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

// Protects /admin/norva/products, /new and /[id]/edit (some are client pages).
export default async function NorvaProductsLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireAdminPage("/admin/norva/login");

    return <>{children}</>;
}
