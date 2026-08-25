import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ModerateButton from "./ModerateButton";

type IncidentDetail = {
    id: string;
    public_id: string;
    title: string;
    description: string;
    incident_date: string;
    status: string;
    verification_status: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    category: string | null;
    category_slug: string | null;
    division: string | null;
    division_slug: string | null;
    district: string | null;
    district_slug: string | null;
};

type ModerationRow = {
    id: string;
    action: string;
    notes: string | null;
    created_at: string;
    admin_user: { display_name: string } | null;
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

function actionLabel(action: string): string {
    const labels: Record<string, string> = {
        started_review: "পর্যালোচনা শুরু",
        approved: "অনুমোদিত",
        rejected: "প্রত্যাখ্যাত",
        needs_revision: "সংশোধন প্রয়োজন",
        archived: "সংরক্ষিত",
        edited: "সম্পাদিত",
        redacted: "সরানো হয়েছে",
        restored: "পুনরুদ্ধার",
    };
    return labels[action] ?? action;
}

export default async function IncidentReviewPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ success?: string }>;
}) {
    const { id } = await params;
    const { success } = await searchParams;

    if (success === "approved" || success === "rejected") {
        redirect(`/admin/incidents/${id}`);
    }

    const supabase = await createClient();

    const { data: incidentRaw, error: fetchError } = await supabase
        .from("incidents")
        .select(
            `
            id,
            public_id,
            title,
            description,
            incident_date,
            status,
            verification_status,
            created_at,
            updated_at,
            published_at,
            category:categories(name, slug),
            division:divisions(name, slug),
            district:districts(name, slug)
        `,
        )
        .eq("id", id)
        .maybeSingle();

    if (fetchError) {
        console.error(
            "[OpenWitness] Incident query failed:",
            JSON.stringify(
                {
                    code: fetchError.code,
                    message: fetchError.message,
                    details: fetchError.details,
                    hint: fetchError.hint,
                },
                null,
                2,
            ),
        );
    }

    if (!incidentRaw) {
        notFound();
    }

    const incident: IncidentDetail = {
        id: incidentRaw.id,
        public_id: incidentRaw.public_id,
        title: incidentRaw.title,
        description: incidentRaw.description,
        incident_date: incidentRaw.incident_date,
        status: incidentRaw.status,
        verification_status: incidentRaw.verification_status,
        created_at: incidentRaw.created_at,
        updated_at: incidentRaw.updated_at,
        published_at: incidentRaw.published_at,
        category: Array.isArray(incidentRaw.category)
            ? incidentRaw.category[0]?.name ?? null
            : (incidentRaw.category as { name: string } | null)?.name ?? null,
        category_slug: Array.isArray(incidentRaw.category)
            ? incidentRaw.category[0]?.slug ?? null
            : (incidentRaw.category as { slug: string } | null)?.slug ?? null,
        division: Array.isArray(incidentRaw.division)
            ? incidentRaw.division[0]?.name ?? null
            : (incidentRaw.division as { name: string } | null)?.name ?? null,
        division_slug: Array.isArray(incidentRaw.division)
            ? incidentRaw.division[0]?.slug ?? null
            : (incidentRaw.division as { slug: string } | null)?.slug ?? null,
        district: Array.isArray(incidentRaw.district)
            ? incidentRaw.district[0]?.name ?? null
            : (incidentRaw.district as { name: string } | null)?.name ?? null,
        district_slug: Array.isArray(incidentRaw.district)
            ? incidentRaw.district[0]?.slug ?? null
            : (incidentRaw.district as { slug: string } | null)?.slug ?? null,
    };

    const { data: moderationActions } = await supabase
        .from("moderation_actions")
        .select(
            `
            id,
            action,
            notes,
            created_at,
            admin_user:admin_users(display_name)
        `,
        )
        .eq("incident_id", id)
        .order("created_at", { ascending: true });

    const actions: ModerationRow[] = (moderationActions ?? []).map(
        (row) => ({
            id: row.id,
            action: row.action,
            notes: row.notes,
            created_at: row.created_at,
            admin_user: Array.isArray(row.admin_user)
                ? row.admin_user[0] ?? null
                : (row.admin_user as { display_name: string } | null),
        }),
    );

    const canModerate =
        incident.status === "pending" ||
        incident.status === "under_review" ||
        incident.status === "needs_revision";

    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/admin"
                    className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
                >
                    ← ড্যাশবোর্ডে ফিরে যান
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={statusStyles(
                                    incident.status,
                                )}
                            >
                                {statusLabel(incident.status)}
                            </span>

                            <span className="text-sm text-zinc-400">
                                {incident.public_id}
                            </span>
                        </div>

                        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                            {incident.title}
                        </h1>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
                            {incident.category ? (
                                <div>
                                    <span className="font-medium text-zinc-700">
                                        শ্রেণি:
                                    </span>{" "}
                                    {incident.category}
                                </div>
                            ) : null}

                            {incident.division &&
                            incident.district ? (
                                <div>
                                    <span className="font-medium text-zinc-700">
                                        অবস্থান:
                                    </span>{" "}
                                    {incident.division} →{" "}
                                    {incident.district}
                                </div>
                            ) : null}

                            {incident.incident_date ? (
                                <div>
                                    <span className="font-medium text-zinc-700">
                                        ঘটনার তারিখ:
                                    </span>{" "}
                                    {formatDate(
                                        incident.incident_date,
                                    )}
                                </div>
                            ) : null}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-sm font-semibold text-zinc-500">
                                বিস্তারিত বিবরণ
                            </h2>

                            <div className="mt-3 whitespace-pre-wrap leading-7 text-zinc-700">
                                {incident.description}
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium text-zinc-500">
                                    যাচাইকরণ অবস্থা
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {incident.verification_status ===
                                    "reported"
                                        ? "প্রতিবেদিত"
                                        : incident.verification_status ===
                                          "verified"
                                          ? "যাচাইকৃত"
                                          : incident.verification_status ===
                                            "disputed"
                                            ? "বিতর্কিত"
                                            : incident.verification_status}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-zinc-500">
                                    জমা দেওয়া হয়েছে
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {formatDateTime(
                                        incident.created_at,
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-zinc-500">
                                    শেষ আপডেট
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {formatDateTime(
                                        incident.updated_at,
                                    )}
                                </p>
                            </div>

                            {incident.published_at ? (
                                <div>
                                    <p className="text-xs font-medium text-zinc-500">
                                        প্রকাশিত
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {formatDateTime(
                                            incident.published_at,
                                        )}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {canModerate ? (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <h2 className="text-sm font-semibold text-zinc-500">
                                পর্যালোচনা
                            </h2>

                            <div className="mt-4 space-y-3">
                                <ModerateButton
                                    incidentId={incident.id}
                                    action="approved"
                                    label="অনুমোদন করুন"
                                    variant="success"
                                />

                                <ModerateButton
                                    incidentId={incident.id}
                                    action="rejected"
                                    label="প্রত্যাখ্যান করুন"
                                    variant="danger"
                                />
                            </div>
                        </div>
                    ) : null}

                    {actions.length > 0 ? (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <h2 className="text-sm font-semibold text-zinc-500">
                                মডারেশন ইতিহাস
                            </h2>

                            <div className="mt-4 space-y-4">
                                {actions.map((modAction) => (
                                    <div
                                        key={modAction.id}
                                        className="border-l-2 border-zinc-200 pl-4"
                                    >
                                        <p className="text-sm font-semibold">
                                            {actionLabel(
                                                modAction.action,
                                            )}
                                        </p>

                                        {modAction.admin_user ? (
                                            <p className="text-xs text-zinc-500">
                                                {modAction.admin_user
                                                    .display_name}
                                            </p>
                                        ) : null}

                                        <p className="text-xs text-zinc-400">
                                            {formatDateTime(
                                                modAction.created_at,
                                            )}
                                        </p>

                                        {modAction.notes ? (
                                            <p className="mt-1 text-sm text-zinc-600">
                                                {modAction.notes}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
