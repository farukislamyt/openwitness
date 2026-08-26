import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import SearchForm from "./SearchForm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type IncidentRow = {
    id: string | null;
    public_id: string | null;
    title: string | null;
    description: string | null;
    incident_date: string | null;
    verification_status: string | null;
    published_at: string | null;
    category: string | null;
    category_slug: string | null;
    division: string | null;
    division_slug: string | null;
    district: string | null;
    district_slug: string | null;
};

type CategoryRow = {
    name: string;
    slug: string;
};

type DivisionRow = {
    name: string;
    slug: string;
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function verificationLabel(status: string | null): string {
    switch (status) {
        case "reported":
            return "প্রতিবেদিত";
        case "verified":
            return "যাচাইকৃত";
        case "disputed":
            return "বিতর্কিত";
        default:
            return status ?? "";
    }
}

function verificationStyles(status: string | null): string {
    const base =
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold";

    switch (status) {
        case "verified":
            return `${base} bg-green-100 text-green-800`;
        case "disputed":
            return `${base} bg-red-100 text-red-800`;
        default:
            return `${base} bg-zinc-100 text-zinc-600`;
    }
}

export const metadata = {
    title: "প্রকাশিত ঘটনা",
    description:
        "OpenWitness-এ প্রকাশিত জনস্বার্থ সংশ্লিষ্ট ঘটনাসমূহ দেখুন।",
};

export default async function IncidentsPage({
    searchParams,
}: {
    searchParams: Promise<{
        category?: string;
        division?: string;
        page?: string;
        q?: string;
    }>;
}) {
    const params = await searchParams;
    const categorySlug = params.category ?? "";
    const divisionSlug = params.division ?? "";
    const searchQuery = params.q ?? "";
    const currentPage = Math.max(1, Number(params.page) || 1);
    const pageSize = 20;
    const offset = (currentPage - 1) * pageSize;

    const supabase = await createClient();

    const [
        categoriesResult,
        divisionsResult,
    ] = await Promise.all([
        supabase
            .from("categories")
            .select("name, slug")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),

        supabase
            .from("divisions")
            .select("name, slug")
            .order("sort_order", { ascending: true }),
    ]);

    const categories: CategoryRow[] = categoriesResult.data ?? [];
    const divisions: DivisionRow[] = divisionsResult.data ?? [];

    let query = supabase
        .from("public_incidents")
        .select(
            "id, public_id, title, description, incident_date, verification_status, published_at, category, category_slug, division, division_slug, district, district_slug",
            { count: "exact" },
        );

    if (categorySlug) {
        query = query.eq("category_slug", categorySlug);
    }

    if (divisionSlug) {
        query = query.eq("division_slug", divisionSlug);
    }

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data: incidentsRaw, count, error: queryError } = await query
        .order("published_at", { ascending: false })
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

    const incidents: IncidentRow[] = (incidentsRaw ?? []).map((row) => ({
        id: row.id,
        public_id: row.public_id,
        title: row.title,
        description: row.description,
        incident_date: row.incident_date,
        verification_status: row.verification_status,
        published_at: row.published_at,
        category: row.category,
        category_slug: row.category_slug,
        division: row.division,
        division_slug: row.division_slug,
        district: row.district,
        district_slug: row.district_slug,
    }));

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    function buildUrl(
        overrides: Record<string, string>,
    ): string {
        const sp = new URLSearchParams();
        if (overrides.category || categorySlug) {
            sp.set("category", overrides.category || categorySlug);
        }
        if (overrides.division || divisionSlug) {
            sp.set("division", overrides.division || divisionSlug);
        }
        if (searchQuery) {
            sp.set("q", searchQuery);
        }
        if (overrides.page && overrides.page !== "1") {
            sp.set("page", overrides.page);
        }
        const qs = sp.toString();
        return qs ? `/incidents?${qs}` : "/incidents";
    }

    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <SiteHeader />

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold tracking-wide text-zinc-500">
                        প্রকাশিত ঘটনা
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                        ঘটনাসমূহ
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-600">
                        অনুমোদিত ও প্রকাশিত জনস্বার্থ সংশ্লিষ্ট ঘটনাসমূহ দেখুন।
                    </p>
                </div>

                {categories.length > 0 || divisions.length > 0 ? (
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href={buildUrl({
                                category: "",
                                page: "1",
                            })}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                !categorySlug
                                    ? "bg-zinc-950 text-white"
                                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                            }`}
                        >
                            সব
                        </Link>

                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={buildUrl({
                                    category: cat.slug,
                                    page: "1",
                                })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    categorySlug === cat.slug
                                        ? "bg-zinc-950 text-white"
                                        : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                                }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                ) : null}

                {divisions.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {divisions.map((div) => (
                            <Link
                                key={div.slug}
                                href={buildUrl({
                                    division:
                                        divisionSlug === div.slug
                                            ? ""
                                            : div.slug,
                                    page: "1",
                                })}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    divisionSlug === div.slug
                                        ? "bg-zinc-800 text-white"
                                        : "border border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                                }`}
                            >
                                {div.name}
                            </Link>
                        ))}
                    </div>
                ) : null}

                <div className="mt-6">
                    <Suspense>
                        <SearchForm />
                    </Suspense>
                </div>
            </section>

            <section className="border-t border-zinc-200">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
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
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl text-zinc-400">
                                ০
                            </div>

                            <h2 className="mt-4 text-lg font-semibold">
                                কোনো ঘটনা পাওয়া যায়নি
                            </h2>

                            <p className="mt-2 text-sm text-zinc-500">
                                {categorySlug || divisionSlug || searchQuery
                                    ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।"
                                    : "এখনো কোনো ঘটনা প্রকাশিত হয়নি।"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="mb-6 text-sm text-zinc-500">
                                মোট {totalCount} টি ঘটনা
                                {categorySlug || divisionSlug || searchQuery
                                    ? " (ফিল্টার্ড)"
                                    : ""}
                            </p>

                            <div className="space-y-4">
                                {incidents.map((incident) => (
                                    <Link
                                        key={incident.id}
                                        href={`/incidents/${incident.id}`}
                                        className="block rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 hover:shadow-sm"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-xs text-zinc-400">
                                                        {incident.public_id}
                                                    </span>

                                                    {incident.verification_status &&
                                                    incident.verification_status !==
                                                        "reported" ? (
                                                        <span
                                                            className={verificationStyles(
                                                                incident.verification_status,
                                                            )}
                                                        >
                                                            {verificationLabel(
                                                                incident.verification_status,
                                                            )}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                <h2 className="mt-2 text-lg font-semibold leading-tight">
                                                    {incident.title}
                                                </h2>

                                                {incident.description ? (
                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                                                        {incident.description}
                                                    </p>
                                                ) : null}

                                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
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
                                                            {formatDate(
                                                                incident.incident_date,
                                                            )}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {incident.published_at ? (
                                                <div className="flex-shrink-0 text-xs text-zinc-400">
                                                    প্রকাশিত:{" "}
                                                    {formatDate(
                                                        incident.published_at,
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {totalPages > 1 ? (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    {currentPage > 1 ? (
                                        <Link
                                            href={buildUrl({
                                                page: String(
                                                    currentPage - 1,
                                                ),
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
                                                page: String(
                                                    currentPage + 1,
                                                ),
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
            </section>

            <SiteFooter />
        </main>
    );
}
