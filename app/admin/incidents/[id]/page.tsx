import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ModerateButton from "./ModerateButton";
import { formatDate, formatDateTime } from "@/lib/format";
import {
    statusLabel,
    statusStyles,
    verificationLabel,
    actionLabel,
    actionStyles,
} from "@/lib/admin-utils";

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
                            <span className={statusStyles(incident.status)}>
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

                            {incident.division && incident.district ? (
                                <div>
                                    <span className="font-medium text-zinc-700">
                                        অবস্থান:
                                    </span>{" "}
                                    {incident.division} → {incident.district}
                                </div>
                            ) : null}

                            {incident.incident_date ? (
                                <div>
                                    <span className="font-medium text-zinc-700">
                                        ঘটনার তারিখ:
                                    </span>{" "}
                                    {formatDate(incident.incident_date)}
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
                                    {verificationLabel(incident.verification_status)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-zinc-500">
                                    জমা দেওয়া হয়েছে
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {formatDateTime(incident.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-zinc-500">
                                    শেষ আপডেট
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {formatDateTime(incident.updated_at)}
                                </p>
                            </div>

                            {incident.published_at ? (
                                <div>
                                    <p className="text-xs font-medium text-zinc-500">
                                        প্রকাশিত
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {formatDateTime(incident.published_at)}
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
                                        <div className="flex items-center gap-2">
                                            <span className={actionStyles(modAction.action)}>
                                                {actionLabel(modAction.action)}
                                            </span>
                                        </div>

                                        {modAction.admin_user ? (
                                            <p className="mt-1 text-xs text-zinc-500">
                                                {modAction.admin_user.display_name}
                                            </p>
                                        ) : null}

                                        <p className="text-xs text-zinc-400">
                                            {formatDateTime(modAction.created_at)}
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
