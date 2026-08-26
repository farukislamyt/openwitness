import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { actionLabel, actionStyles } from "@/lib/admin-utils";
import Link from "next/link";

export const metadata = {
    title: "অডিট ইতিহাস",
};

type AuditRow = {
    id: string;
    action: string;
    notes: string | null;
    created_at: string;
    admin_user: { display_name: string } | null;
    incident: { public_id: string; title: string } | null;
};

export default async function AdminAuditPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const currentPage = Math.max(1, Number(params.page) || 1);
    const pageSize = 30;
    const offset = (currentPage - 1) * pageSize;

    const supabase = await createClient();

    const { data: actionsRaw, count, error: queryError } = await supabase
        .from("moderation_actions")
        .select(
            `
            id,
            action,
            notes,
            created_at,
            admin_user:admin_users(display_name),
            incident:incidents(public_id, title)
        `,
            { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (queryError) {
        console.error(
            "[OpenWitness] Audit query failed:",
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

    const actions: AuditRow[] = (actionsRaw ?? []).map((row) => ({
        id: row.id,
        action: row.action,
        notes: row.notes,
        created_at: row.created_at,
        admin_user: Array.isArray(row.admin_user)
            ? row.admin_user[0] ?? null
            : (row.admin_user as { display_name: string } | null),
        incident: Array.isArray(row.incident)
            ? row.incident[0] ?? null
            : (row.incident as { public_id: string; title: string } | null),
    }));

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    অডিট ইতিহাস
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    সকল মডারেশন কার্যক্রমের নথি।
                </p>
            </div>

            {queryError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    <p className="font-semibold">তথ্য লোড করা যায়নি।</p>
                    <p className="mt-1">কিছুক্ষণ পর পৃষ্ঠাটি রিফ্রেশ করুন।</p>
                </div>
            ) : actions.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                    <h2 className="text-lg font-semibold">
                        কোনো অডিট রেকর্ড নেই
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        মডারেশন কার্যক্রম শুরু হলে এখানে দেখা যাবে।
                    </p>
                </div>
            ) : (
                <>
                    <p className="mb-4 text-sm text-zinc-500">
                        মোট {totalCount} টি রেকর্ড
                    </p>

                    <div className="space-y-3">
                        {actions.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-zinc-200 bg-white p-5"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={actionStyles(item.action)}>
                                                {actionLabel(item.action)}
                                            </span>

                                            {item.incident ? (
                                                <Link
                                                    href={`/admin/incidents/${item.incident.public_id}`}
                                                    className="text-xs text-zinc-400 hover:text-zinc-700"
                                                >
                                                    {item.incident.public_id}
                                                </Link>
                                            ) : null}
                                        </div>

                                        {item.incident ? (
                                            <p className="mt-1 text-sm font-medium text-zinc-700">
                                                {item.incident.title}
                                            </p>
                                        ) : null}

                                        {item.notes ? (
                                            <p className="mt-2 text-sm text-zinc-600">
                                                {item.notes}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="flex-shrink-0 text-right text-xs text-zinc-400">
                                        {item.admin_user ? (
                                            <p className="font-medium text-zinc-600">
                                                {item.admin_user.display_name}
                                            </p>
                                        ) : null}

                                        <p>{formatDateTime(item.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 ? (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {currentPage > 1 ? (
                                <Link
                                    href={`/admin/audit?page=${currentPage - 1}`}
                                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                                >
                                    পূর্ববর্তী
                                </Link>
                            ) : null}

                            <span className="px-4 py-2 text-sm text-zinc-500">
                                পৃষ্ঠা {currentPage} / {totalPages}
                            </span>

                            {currentPage < totalPages ? (
                                <Link
                                    href={`/admin/audit?page=${currentPage + 1}`}
                                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                                >
                                    পরবর্তী
                                </Link>
                            ) : null}
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}
