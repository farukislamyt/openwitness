import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "./AdminHeader";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login?redirect=/admin");
    }

    const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("id, display_name, role, is_active")
        .eq("auth_user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

    if (adminError || !adminUser) {
        redirect("/login?error=not_admin");
    }

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-950">
            <AdminHeader
                displayName={adminUser.display_name}
                role={adminUser.role}
            />
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                {children}
            </div>
        </main>
    );
}
