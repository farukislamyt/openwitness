import { createClient } from "@/lib/supabase/server";
import ReviewReportButton from "./ReviewReportButton";
import { formatShortDate } from "@/lib/format";

type SupabaseReportRow = {
    id: string;
    incident_id: string;
    reason: string;
    description: string | null;
    created_at: string;
    incidents: {
        public_id: string;
        title: string;
        categories: { name: string } | null;
        divisions: { name: string } | null;
        districts: { name: string } | null;
    } | null;
};

type ReportRow = {
    id: string;
    incident_id: string;
    reason: string;
    description: string | null;
    created_at: string;
    public_id: string;
    title: string;
    category_name: string | null;
    division_name: string | null;
    district_name: string | null;
};

function reasonLabel(reason: string): string {
    switch (reason) {
        case "personal_information":
            return "ব্যক্তিগত তথ্য";
        case "false_or_misleading":
            return "মিথ্যা বা বিভ্রান্তিকর";
        case "harassment_or_hate":
            return "হয়রানি বা ঘৃণা";
        case "threat_or_violence":
            return "হুমুকি বা সহিংসতা";
        case "duplicate":
            return "ডুপ্লিকেট";
        case "other":
            return "অন্যান্য";
        default:
            return reason;
    }
}

export const metadata = {
    title: "রিপোর্ট পর্যালোচনা",
};

export default async function AdminReportsPage() {
    const supabase = await createClient();

    const { data: reportsRaw, error: queryError } = await supabase
        .from("incident_reports")
        .select(
            "id, incident_id, reason, description, created_at, incidents!inner(public_id, title, categories(name), divisions(name), districts(name))",
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (queryError) {
        console.error(
            "[OpenWitness] Reports query failed:",
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

    const reports: ReportRow[] = (reportsRaw ?? []).map((row: SupabaseReportRow) => ({
        id: row.id,
        incident_id: row.incident_id,
        reason: row.reason,
        description: row.description,
        created_at: row.created_at,
        public_id: row.incidents?.public_id ?? "",
        title: row.incidents?.title ?? "",
        category_name: row.incidents?.categories?.name ?? null,
        division_name: row.incidents?.divisions?.name ?? null,
        district_name: row.incidents?.districts?.name ?? null,
    }));

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    রিপোর্ট পর্যালোচনা
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    প্রকাশিত ঘটনা বিরোধী রিপোর্টসমূহ পর্যালোচনা করুন।
                </p>
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
            ) : reports.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                        ✓
                    </div>

                    <h2 className="mt-4 text-lg font-semibold">
                        নতুন রিপোর্ট নেই
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        সব রিপোর্ট পর্যালোচনা করা হয়েছে।
                    </p>
                </div>
            ) : (
                <>
                    <p className="mb-4 text-sm text-zinc-500">
                        মোট {reports.length} টি রিপোর্ট পর্যালোচনার অপেক্ষায়
                    </p>

                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="rounded-2xl border border-zinc-200 bg-white p-6"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                                                {reasonLabel(
                                                    report.reason,
                                                )}
                                            </span>

                                            <span className="text-xs text-zinc-400">
                                                {report.public_id}
                                            </span>
                                        </div>

                                        <h3 className="mt-2 font-semibold">
                                            {report.title}
                                        </h3>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                                            {report.category_name ? (
                                                <span>
                                                    {
                                                        report.category_name
                                                    }
                                                </span>
                                            ) : null}

                                            {report.division_name &&
                                            report.district_name ? (
                                                <span>
                                                    {
                                                        report.division_name
                                                    }{" "}
                                                    →{" "}
                                                    {
                                                        report.district_name
                                                    }
                                                </span>
                                            ) : null}

                                            <span>
                                                {formatShortDate(
                                                    report.created_at,
                                                )}
                                            </span>
                                        </div>

                                        {report.description ? (
                                            <p className="mt-3 text-sm leading-6 text-zinc-600">
                                                {report.description}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-shrink-0 gap-2">
                                        <ReviewReportButton
                                            reportId={report.id}
                                            action="dismissed"
                                            label="বাতিল"
                                            variant="secondary"
                                        />

                                        <ReviewReportButton
                                            reportId={report.id}
                                            action="action_taken"
                                            label="কার্যকর"
                                            variant="primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
