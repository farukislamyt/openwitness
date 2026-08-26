import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { IncidentList, type IncidentRow } from "../IncidentList";
import IncidentFilterForm from "../IncidentFilterForm";
import { STATUS_OPTIONS } from "@/lib/admin-utils";

export const metadata = {
    title: "সব রিপোর্ট",
};

export default async function AdminIncidentsPage({
    searchParams,
}: {
    searchParams: Promise<{
        status?: string;
        q?: string;
        category?: string;
        division?: string;
        date_from?: string;
        date_to?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const statusFilter = params.status ?? "";
    const searchQuery = params.q ?? "";
    const categoryFilter = params.category ?? "";
    const divisionFilter = params.division ?? "";
    const dateFrom = params.date_from ?? "";
    const dateTo = params.date_to ?? "";
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
            published_at,
            category:categories(name),
            division:divisions(name),
            district:districts(name)
        `,
            { count: "exact" },
        );

    if (statusFilter) {
        query = query.eq("status", statusFilter as "pending" | "under_review" | "needs_revision" | "approved" | "rejected" | "archived");
    }

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,public_id.ilike.%${searchQuery}%`);
    }

    if (categoryFilter) {
        query = query.eq("category_id", categoryFilter);
    }

    if (divisionFilter) {
        query = query.eq("division_id", Number(divisionFilter));
    }

    if (dateFrom) {
        query = query.gte("incident_date", dateFrom);
    }

    if (dateTo) {
        query = query.lte("incident_date", dateTo);
    }

    const { data: incidentsRaw, count, error: queryError } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (queryError) {
        console.error(
            "[OpenWitness] Incidents query failed:",
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
            published_at: row.published_at,
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

    const { data: categories } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order");

    const { data: divisions } = await supabase
        .from("divisions")
        .select("id, name")
        .order("sort_order");

    const categoryOptions = (categories ?? []).map((c) => ({
        value: c.id,
        label: c.name,
    }));

    const divisionOptions = (divisions ?? []).map((d) => ({
        value: String(d.id),
        label: d.name,
    }));

    const currentParams: Record<string, string> = {};
    if (statusFilter) currentParams.status = statusFilter;
    if (searchQuery) currentParams.q = searchQuery;
    if (categoryFilter) currentParams.category = categoryFilter;
    if (divisionFilter) currentParams.division = divisionFilter;
    if (dateFrom) currentParams.date_from = dateFrom;
    if (dateTo) currentParams.date_to = dateTo;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    সব রিপোর্ট
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    সকল রিপোর্ট দেখুন এবং ফিল্টার করুন।
                </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => {
                    const sp = new URLSearchParams(currentParams);
                    if (opt.value) sp.set("status", opt.value);
                    else sp.delete("status");
                    sp.delete("page");
                    const qs = sp.toString();

                    return (
                        <a
                            key={opt.value}
                            href={qs ? `/admin/incidents?${qs}` : "/admin/incidents"}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                statusFilter === opt.value ||
                                (!statusFilter && !opt.value)
                                    ? "bg-zinc-950 text-white"
                                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                            }`}
                        >
                            {opt.label}
                        </a>
                    );
                })}
            </div>

            <div className="mb-6">
                <Suspense>
                    <IncidentFilterForm
                        basePath="/admin/incidents"
                        categoryOptions={categoryOptions}
                        divisionOptions={divisionOptions}
                    />
                </Suspense>
            </div>

            {queryError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    <p className="font-semibold">তথ্য লোড করা যায়নি।</p>
                    <p className="mt-1">কিছুক্ষণ পর পৃষ্ঠাটি রিফ্রেশ করুন।</p>
                </div>
            ) : (
                <IncidentList
                    incidents={incidents}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/admin/incidents"
                    currentParams={currentParams}
                    emptyMessage="কোনো রিপোর্ট পাওয়া যায়নি।"
                />
            )}
        </div>
    );
}
