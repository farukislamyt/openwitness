import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    const { data: pendingIncidents, error: pendingError } = await supabase
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
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    const { count: totalCount } = await supabase
        .from("incidents")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

    if (pendingError) {
        console.error(
            "[OpenWitness] Dashboard query failed:",
            JSON.stringify(
                {
                    code: pendingError.code,
                    message: pendingError.message,
                    details: pendingError.details,
                    hint: pendingError.hint,
                },
                null,
                2,
            ),
        );
    }

    const incidents: IncidentRow[] = (pendingIncidents ?? []).map(
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

    const pendingCount = totalCount ?? 0;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    ড্যাশবোর্ড
                </h1>

                <p className="mt-2 text-zinc-600">
                    অনুমোদনের জন্য অপেক্ষমাণ রিপোর্ট পর্যালোচনা করুন।
                </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <p className="text-sm font-medium text-zinc-500">
                        অপেক্ষমাণ রিপোর্ট
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {pendingCount}
                    </p>
                </div>
            </div>

            {pendingError ? (
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
                        কোনো অপেক্ষমাণ রিপোর্ট নেই
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        সব রিপোর্ট ইতিমধ্যে পর্যালোচিত হয়েছে।
                    </p>
                </div>
            ) : (
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
            )}
        </div>
    );
}
