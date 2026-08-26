import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatShortDate } from "@/lib/format";
import { roleLabel } from "@/lib/admin-utils";
import LogoutButton from "./LogoutButton";

export const metadata = {
    title: "প্রোফাইল",
};

export default async function AdminProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login?redirect=/admin/profile");
    }

    const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("id, display_name, role, is_active, created_at, updated_at")
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (adminError || !adminUser) {
        redirect("/login?error=not_admin");
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    প্রোফাইল
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    আপনার প্রশাসনিক প্রোফাইল তথ্য।
                </p>
            </div>

            <div className="max-w-lg space-y-6">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-zinc-500">
                        পরিচয়
                    </h2>

                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                প্রদর্শন নাম
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {adminUser.display_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                ইমেইল
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {user.email ?? "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                ভূমিকা
                            </p>

                            <p className="mt-1">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        adminUser.role === "admin"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {roleLabel(adminUser.role)}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                অবস্থা
                            </p>

                            <p className="mt-1">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        adminUser.is_active
                                            ? "bg-green-100 text-green-800"
                                            : "bg-zinc-100 text-zinc-500"
                                    }`}
                                >
                                    {adminUser.is_active
                                        ? "সক্রিয়"
                                        : "নিষ্ক্রিয়"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-zinc-500">
                        অ্যাকাউন্ট
                    </h2>

                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                অ্যাডমিন আইডি
                            </p>

                            <p className="mt-1 font-mono text-xs text-zinc-600">
                                {adminUser.id}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                যোগদান
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {formatShortDate(adminUser.created_at)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                শেষ আপডেট
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {formatShortDate(adminUser.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-zinc-500">
                        কার্যক্রম
                    </h2>

                    <div className="mt-4">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
