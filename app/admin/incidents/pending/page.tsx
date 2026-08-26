import { createClient } from "@/lib/supabase/server";
import { IncidentList, type IncidentRow } from "../../IncidentList";

export const metadata = {
    title: "অপেক্ষমাণ রিপোর্ট",
};

export default async function AdminPendingPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
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
            published_at,
            category:categories(name),
            division:divisions(name),
            district:districts(name)
        `,
            { count: "exact" },
        )
        .in("status", ["pending", "under_review", "needs_revision"]);

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,public_id.ilike.%${searchQuery}%`);
    }

    const { data: incidentsRaw, count, error: queryError } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (queryError) {
        console.error(
            "[OpenWitness] Pending incidents query failed:",
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

    const currentParams: Record<string, string> = {};
    if (searchQuery) currentParams.q = searchQuery;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    অপেক্ষমাণ রিপোর্ট
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    নতুন, পর্যালোচনাধীন এবং সংশোধন প্রয়োজনীয় রিপোর্ট।
                </p>
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
                    basePath="/admin/incidents/pending"
                    currentParams={currentParams}
                    emptyMessage="কোনো অপেক্ষমাণ রিপোর্ট নেই।"
                />
            )}
        </div>
    );
}
