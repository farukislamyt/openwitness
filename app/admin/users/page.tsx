import { createClient } from "@/lib/supabase/server";
import AdminUserForm from "./AdminUserForm";

type AdminUserRow = {
    id: string;
    auth_user_id: string;
    display_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function roleLabel(role: string): string {
    switch (role) {
        case "admin":
            return "অ্যাডমিন";
        case "moderator":
            return "মডারেটর";
        default:
            return role;
    }
}

export const metadata = {
    title: "ব্যবহারকারী ব্যবস্থাপনা",
};

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const { data: usersRaw, error: queryError } = await supabase
        .from("admin_users")
        .select("id, auth_user_id, display_name, role, is_active, created_at, updated_at")
        .order("created_at", { ascending: false });

    if (queryError) {
        console.error(
            "[OpenWitness] Admin users query failed:",
            JSON.stringify(
                {
                    code: queryError.code,
                    message: queryError.message,
                    details: queryError.details,
                    hint: queryError.hint,
                },
                null,
                2,
            ),
        );
    }

    const users: AdminUserRow[] = (usersRaw ?? []).map((row) => ({
        id: row.id,
        auth_user_id: row.auth_user_id,
        display_name: row.display_name,
        role: row.role,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at,
    }));

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        ব্যবহারকারী ব্যবস্থাপনা
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        অ্যাডমিন ও মডারেটর ব্যবহারকারী পরিচালনা করুন।
                    </p>
                </div>

                <AdminUserForm mode="create" />
            </div>

            {queryError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    <p className="font-semibold">
                        তথ্য লোড করা যায়নি।
                    </p>
                    <p className="mt-1">
                        কিছুক্ষণ পর পৃষ্ঠাটি রিফ্রেশ করুন।
                    </p>
                </div>
            ) : users.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                    <h2 className="text-lg font-semibold">
                        কোনো ব্যবহারকারী নেই
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        প্রথম ব্যবহারকারীটি যোগ করুন।
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`rounded-2xl border bg-white p-5 transition ${
                                user.is_active
                                    ? "border-zinc-200"
                                    : "border-zinc-200 bg-zinc-50 opacity-75"
                            }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-semibold">
                                            {user.display_name}
                                        </span>

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                user.role === "admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {roleLabel(user.role)}
                                        </span>

                                        {!user.is_active ? (
                                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                                                নিষ্ক্রিয়
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                                        <span>
                                            তৈরি: {formatDate(user.created_at)}
                                        </span>

                                        <span>
                                            আপডেট: {formatDate(user.updated_at)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <AdminUserForm
                                        mode="edit"
                                        user={user}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
