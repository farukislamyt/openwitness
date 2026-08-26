import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import AdminSearchForm from "./AdminSearchForm";

type IncidentRow = {
    id: string;
    public_id: string;
    title: string;
    incident_date: string;
    status: string;
    created_at: string;
    category: string | null;
    division: string | null;
    district: string | null;
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: "নতুন",
        under_review: "পর্যালোচনাধীন",
        needs_revision: "সংশোধন প্রয়োজন",
        approved: "অনুমোদিত",
        rejected: "প্রত্যাখ্যাত",
        archived: "সংরক্ষিত",
    };
    return labels[status] ?? status;
}

function statusStyles(status: string): string {
    const base =
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

    switch (status) {
        case "pending":
            return `${base} bg-amber-100 text-amber-800`;
        case "under_review":
            return `${base} bg-blue-100 text-blue-800`;
        case "needs_revision":
            return `${base} bg-orange-100 text-orange-800`;
        case "approved":
            return `${base} bg-green-100 text-green-800`;
        case "rejected":
            return `${base} bg-red-100 text-red-800`;
        default:
            return `${base} bg-zinc-100 text-zinc-800`;
    }
}

type StatusOption = {
    value: string;
    label: string;
};

const STATUS_OPTIONS: StatusOption[] = [
    { value: "", label: "সব" },
    { value: "pending", label: "নতুন" },
    { value: "under_review", label: "পর্যালোচনাধীন" },
    { value: "needs_revision", label: "সংশোধন প্রয়োজন" },
    { value: "approved", label: "অনুমোদিত" },
    { value: "rejected", label: "প্রত্যাখ্যাত" },
];

export const metadata = {
    title: "অ্যাডমিন ড্যাশবোর্ড",
};

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{
        status?: string;
        q?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const statusFilter = params.status ?? "";
    const searchQuery = params.q ?? "";
    const currentPage = Math.max(1, Number(params.page) || 1);
    const pageSize = 20;
    const offset = (currentPage - 1) * pageSize;

    const supabase = await createClient();

    let query = supabase
        .from("incidents")
        .select(
            `
            id,
            public_id,
            title,
            incident_date,
            status,
            created_at,
            category:categories(name),
            division:divisions(name),
            district:districts(name)
        `,
            { count: "exact" },
        );

    if (statusFilter) {
        query = query.eq("status", statusFilter as "pending" | "under_review" | "needs_revision" | "approved" | "rejected" | "archived");
    } else {
        query = query.neq("status", "archived");
    }

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,public_id.ilike.%${searchQuery}%`);
    }

    const { data: incidentsRaw, count, error: queryError } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (queryError) {
        console.error(
            "[OpenWitness] Dashboard query failed:",
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

    const incidents: IncidentRow[] = (incidentsRaw ?? []).map(
        (row) => ({
            id: row.id,
            public_id: row.public_id,
            title: row.title,
            incident_date: row.incident_date,
            status: row.status,
            created_at: row.created_at,
            category: Array.isArray(row.category)
                ? row.category[0]?.name ?? null
                : (row.category as { name: string } | null)?.name ?? null,
            division: Array.isArray(row.division)
                ? row.division[0]?.name ?? null
                : (row.division as { name: string } | null)?.name ?? null,
            district: Array.isArray(row.district)
                ? row.district[0]?.name ?? null
                : (row.district as { name: string } | null)?.name ?? null,
        }),
    );

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    function buildUrl(overrides: Record<string, string>): string {
        const sp = new URLSearchParams();
        if (overrides.status || statusFilter) {
            sp.set("status", overrides.status || statusFilter);
        }
        if (searchQuery) {
            sp.set("q", searchQuery);
        }
        if (overrides.page && overrides.page !== "1") {
            sp.set("page", overrides.page);
        }
        const qs = sp.toString();
        return qs ? `/admin?${qs}` : "/admin";
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    ড্যাশবোর্ড
                </h1>

                <p className="mt-2 text-zinc-600">
                    রিপোর্ট পর্যালোচনা ও পরিচালনা করুন।
                </p>
            </div>

            <div className="mb-6">
                <Suspense>
                    <AdminSearchForm />
                </Suspense>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                    <Link
                        key={opt.value}
                        href={buildUrl({
                            status: opt.value,
                            page: "1",
                        })}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            statusFilter === opt.value ||
                            (!statusFilter && !opt.value)
                                ? "bg-zinc-950 text-white"
                                : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                        }`}
                    >
                        {opt.label}
                    </Link>
                ))}
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
            ) : incidents.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl">
                        ✓
                    </div>

                    <h2 className="mt-4 text-lg font-semibold">
                        কোনো রিপোর্ট পাওয়া যায়নি
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        {statusFilter || searchQuery
                            ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।"
                            : "সব রিপোর্ট পর্যালোচিত হয়েছে।"}
                    </p>
                </div>
            ) : (
                <>
                    <p className="mb-4 text-sm text-zinc-500">
                        মোট {totalCount} টি রিপোর্ট
                        {statusFilter || searchQuery ? " (ফিল্টার্ড)" : ""}
                    </p>

                    <div className="space-y-4">
                        {incidents.map((incident) => (
                            <Link
                                key={incident.id}
                                href={`/admin/incidents/${incident.id}`}
                                className="block rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 hover:shadow-sm"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={statusStyles(
                                                    incident.status,
                                                )}
                                            >
                                                {statusLabel(
                                                    incident.status,
                                                )}
                                            </span>

                                            <span className="text-xs text-zinc-400">
                                                {incident.public_id}
                                            </span>
                                        </div>

                                        <h3 className="mt-2 text-lg font-semibold leading-tight">
                                            {incident.title}
                                        </h3>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                                            {incident.category ? (
                                                <span>
                                                    {incident.category}
                                                </span>
                                            ) : null}

                                            {incident.division &&
                                            incident.district ? (
                                                <span>
                                                    {incident.division} →{" "}
                                                    {incident.district}
                                                </span>
                                            ) : null}

                                            {incident.incident_date ? (
                                                <span>
                                                    ঘটনার তারিখ:{" "}
                                                    {formatDate(
                                                        incident.incident_date,
                                                    )}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 text-right text-xs text-zinc-400">
                                        <p>
                                            জমা:{" "}
                                            {formatDateTime(
                                                incident.created_at,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 ? (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {currentPage > 1 ? (
                                <Link
                                    href={buildUrl({
                                        page: String(currentPage - 1),
                                    })}
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
                                    href={buildUrl({
                                        page: String(currentPage + 1),
                                    })}
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
