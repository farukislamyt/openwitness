import Link from "next/link";
import { statusLabel, statusStyles } from "@/lib/admin-utils";
import { formatDate, formatDateTime } from "@/lib/format";

export type IncidentRow = {
    id: string;
    public_id: string;
    title: string;
    incident_date: string;
    status: string;
    created_at: string;
    published_at: string | null;
    category: string | null;
    division: string | null;
    district: string | null;
};

export function IncidentList({
    incidents,
    totalCount,
    currentPage,
    totalPages,
    basePath,
    currentParams,
    emptyMessage,
}: {
    incidents: IncidentRow[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    basePath: string;
    currentParams: Record<string, string>;
    emptyMessage: string;
}) {
    function buildPageUrl(page: number) {
        const sp = new URLSearchParams();
        for (const [key, value] of Object.entries(currentParams)) {
            if (value) sp.set(key, value);
        }
        if (page > 1) sp.set("page", String(page));
        const qs = sp.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    }

    if (incidents.length === 0) {
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl">
                    ✓
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                    কোনো রিপোর্ট পাওয়া যায়নি
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <>
            <p className="mb-4 text-sm text-zinc-500">
                মোট {totalCount} টি রিপোর্ট
            </p>

            <div className="space-y-3">
                {incidents.map((incident) => (
                    <Link
                        key={incident.id}
                        href={`/admin/incidents/${incident.id}`}
                        className="block rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:shadow-sm"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={statusStyles(incident.status)}>
                                        {statusLabel(incident.status)}
                                    </span>

                                    <span className="text-xs text-zinc-400">
                                        {incident.public_id}
                                    </span>
                                </div>

                                <h3 className="mt-2 font-semibold leading-tight">
                                    {incident.title}
                                </h3>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                                    {incident.category ? (
                                        <span>{incident.category}</span>
                                    ) : null}

                                    {incident.division && incident.district ? (
                                        <span>
                                            {incident.division} → {incident.district}
                                        </span>
                                    ) : null}

                                    {incident.incident_date ? (
                                        <span>
                                            ঘটনার তারিখ: {formatDate(incident.incident_date)}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex-shrink-0 text-right text-xs text-zinc-400">
                                <p>জমা: {formatDateTime(incident.created_at)}</p>

                                {incident.published_at ? (
                                    <p className="mt-1">
                                        প্রকাশ: {formatDateTime(incident.published_at)}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {totalPages > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-2">
                    {currentPage > 1 ? (
                        <Link
                            href={buildPageUrl(currentPage - 1)}
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
                            href={buildPageUrl(currentPage + 1)}
                            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                        >
                            পরবর্তী
                        </Link>
                    ) : null}
                </div>
            ) : null}
        </>
    );
}
