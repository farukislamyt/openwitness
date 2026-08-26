import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import HomeSearchForm from "./HomeSearchForm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { formatDate, toBengaliNumber } from "@/lib/format";

function verificationLabel(status: string | null): string {
    switch (status) {
        case "verified":
            return "যাচাইকৃত";
        case "disputed":
            return "বিতর্কিত";
        default:
            return "প্রতিবেদিত";
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

type CategoryRow = { name: string; slug: string; sort_order: number };
type DivisionRow = { name: string; slug: string; sort_order: number };

export default async function Home() {
    const supabase = await createClient();

    const [
        categoriesResult,
        divisionsResult,
        totalCountResult,
        recentResult,
        categoryCountsResult,
        divisionCountsResult,
        districtCountsResult,
    ] = await Promise.all([
        supabase
            .from("categories")
            .select("name, slug, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),

        supabase
            .from("divisions")
            .select("name, slug, sort_order")
            .order("sort_order", { ascending: true }),

        supabase
            .from("public_incidents")
            .select("*", { count: "exact", head: true }),

        supabase
            .from("public_incidents")
            .select(
                "id, public_id, title, description, incident_date, verification_status, published_at, category, category_slug, division, division_slug, district, district_slug",
            )
            .order("published_at", { ascending: false })
            .limit(6),

        supabase
            .from("public_incidents")
            .select("category, category_slug"),

        supabase
            .from("public_incidents")
            .select("division, division_slug"),

        supabase
            .from("public_incidents")
            .select("district, district_slug, division, division_slug"),
    ]);

    const categories: CategoryRow[] = categoriesResult.data ?? [];
    const divisions: DivisionRow[] = divisionsResult.data ?? [];
    const totalIncidents = totalCountResult.count ?? 0;
    const recentIncidents: IncidentRow[] = (recentResult.data ?? []) as IncidentRow[];

    const categoryCountsRaw = categoryCountsResult.data ?? [];
    const divisionCountsRaw = divisionCountsResult.data ?? [];
    const districtCountsRaw = districtCountsResult.data ?? [];

    const categoryCountMap = new Map<string, number>();
    for (const row of categoryCountsRaw) {
        const slug = (row as { category_slug: string }).category_slug;
        if (slug) {
            categoryCountMap.set(slug, (categoryCountMap.get(slug) ?? 0) + 1);
        }
    }

    const divisionCountMap = new Map<string, number>();
    for (const row of divisionCountsRaw) {
        const slug = (row as { division_slug: string }).division_slug;
        if (slug) {
            divisionCountMap.set(slug, (divisionCountMap.get(slug) ?? 0) + 1);
        }
    }

    type DistrictAgg = {
        name: string;
        slug: string;
        division: string;
        divisionSlug: string;
        count: number;
    };
    const districtMap = new Map<string, DistrictAgg>();
    for (const row of districtCountsRaw) {
        const r = row as {
            district: string;
            district_slug: string;
            division: string;
            division_slug: string;
        };
        if (!r.district_slug) continue;
        const existing = districtMap.get(r.district_slug);
        if (existing) {
            existing.count += 1;
        } else {
            districtMap.set(r.district_slug, {
                name: r.district,
                slug: r.district_slug,
                division: r.division,
                divisionSlug: r.division_slug,
                count: 1,
            });
        }
    }

    const topDistricts = Array.from(districtMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

    const divisionExploration = divisions
        .map((d) => ({
            ...d,
            count: divisionCountMap.get(d.slug) ?? 0,
        }))
        .sort((a, b) => b.count - a.count);

    const categoriesWithCounts = categories.map((c) => ({
        ...c,
        count: categoryCountMap.get(c.slug) ?? 0,
    }));

    const totalCategories = categories.length;
    const totalDivisions = divisions.length;
    const totalDistricts = districtMap.size;

    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "OpenWitness",
                    url: "https://openwitness.vercel.app",
                    description:
                        "বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform।",
                    inLanguage: "bn",
                    potentialAction: {
                        "@type": "SearchAction",
                        target: "https://openwitness.vercel.app/incidents?q={search_term_string}",
                        "query-input": "required name=search_term_string",
                    },
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "OpenWitness",
                    url: "https://openwitness.vercel.app",
                    description:
                        "বাংলাদেশের জনস্বার্থে একটি anonymous public-interest incident reporting platform।",
                    foundingDate: "2026",
                    applicationCategory: "Communications",
                    operatingSystem: "Web",
                    inLanguage: "bn",
                    sameAs: [],
                }}
            />

            <SiteHeader />

            {/* Hero */}
            <section className="border-b border-zinc-200">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="max-w-4xl">
                        <p className="mb-6 text-sm font-semibold tracking-wide text-zinc-500">
                            বাংলাদেশের জনস্বার্থে
                        </p>

                        <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-7xl">
                            জনস্বার্থের ঘটনা
                            <br />
                            নথিভুক্ত করুন।
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
                            পরিচয় প্রকাশ না করেই জনস্বার্থ সংশ্লিষ্ট ঘটনা
                            রিপোর্ট করুন। প্রতিটি রিপোর্ট যাচাই ও
                            moderation-এর পর প্রকাশ করা হয়।
                        </p>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/report"
                                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
                            >
                                রিপোর্ট করুন
                            </Link>

                            <Link
                                href="/incidents"
                                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-7 py-3.5 text-base font-semibold transition-colors hover:bg-zinc-100"
                            >
                                রিপোর্ট দেখুন
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Statistics */}
            <section className="border-b border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">
                                প্রকাশিত ঘটনা
                            </p>

                            <p className="mt-2 text-4xl font-bold">
                                {toBengaliNumber(totalIncidents)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-zinc-500">
                                শ্রেণি
                            </p>

                            <p className="mt-2 text-4xl font-bold">
                                {toBengaliNumber(totalCategories)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-zinc-500">
                                বিভাগ
                            </p>

                            <p className="mt-2 text-4xl font-bold">
                                {toBengaliNumber(totalDivisions)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-zinc-500">
                                জেলা
                            </p>

                            <p className="mt-2 text-4xl font-bold">
                                {toBengaliNumber(totalDistricts)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search */}
            <section className="border-b border-zinc-200">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-semibold tracking-wide text-zinc-500">
                            ঘটনা খুঁজুন
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            আপনার এলাকার ঘটনা খুঁজে নিন
                        </h2>
                    </div>

                    <Suspense>
                        <HomeSearchForm
                            categories={categories.map((c) => ({
                                name: c.name,
                                slug: c.slug,
                            }))}
                            divisions={divisions.map((d) => ({
                                name: d.name,
                                slug: d.slug,
                            }))}
                        />
                    </Suspense>
                </div>
            </section>

            {/* Categories */}
            <section className="border-b border-zinc-200">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="mb-8">
                        <p className="text-sm font-semibold tracking-wide text-zinc-500">
                            শ্রেণি অনুযায়ী
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            ১৬টি শ্রেণিতে ঘটনা রিপোর্ট করুন
                        </h2>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {categoriesWithCounts.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/incidents?category=${cat.slug}`}
                                className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                <span className="text-sm font-medium text-zinc-900 group-hover:text-zinc-600">
                                    {cat.name}
                                </span>

                                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
                                    {toBengaliNumber(cat.count)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Division Exploration */}
            <section className="border-b border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="mb-8">
                        <p className="text-sm font-semibold tracking-wide text-zinc-500">
                            বিভাগ অনুযায়ী
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            বাংলাদেশের ৮টি বিভাগ
                        </h2>

                        <p className="mt-4 max-w-2xl text-zinc-600">
                            প্রতিটি বিভাগ থেকে প্রকাশিত ঘটনা দেখুন এবং
                            আপনার এলাকার ঘটনা অনুসন্ধান করুন।
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {divisionExploration.map((div) => (
                            <Link
                                key={div.slug}
                                href={`/incidents?division=${div.slug}`}
                                className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
                            >
                                <span className="text-lg font-bold">
                                    {div.name}
                                </span>

                                <span className="mt-1 text-sm text-zinc-500">
                                    {toBengaliNumber(div.count)} টি ঘটনা
                                </span>
                            </Link>
                        ))}
                    </div>

                    {topDistricts.length > 0 ? (
                        <div className="mt-10">
                            <h3 className="mb-4 text-lg font-semibold">
                                শীর্ষ জেলাসমূহ
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {topDistricts.map((dist) => (
                                    <Link
                                        key={dist.slug}
                                        href={`/incidents?division=${dist.divisionSlug}`}
                                        className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                                    >
                                        {dist.name}
                                        <span className="ml-1.5 text-xs text-zinc-400">
                                            {toBengaliNumber(dist.count)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            {/* Recent Incidents */}
            {recentIncidents.length > 0 ? (
                <section className="border-b border-zinc-200">
                    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <p className="text-sm font-semibold tracking-wide text-zinc-500">
                                    সাম্প্রতিক
                                </p>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                    সাম্প্রতিক প্রকাশিত ঘটনা
                                </h2>
                            </div>

                            <Link
                                href="/incidents"
                                className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-950 sm:inline"
                            >
                                সব দেখুন →
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {recentIncidents.map((incident) => (
                                <Link
                                    key={incident.id}
                                    href={`/incidents/${incident.id}`}
                                    className="group block rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
                                >
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

                                    <h3 className="mt-3 text-base font-semibold leading-tight group-hover:text-zinc-600">
                                        {incident.title}
                                    </h3>

                                    {incident.description ? (
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                                            {incident.description}
                                        </p>
                                    ) : null}

                                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
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
                                </Link>
                            ))}
                        </div>

                        <div className="mt-6 text-center sm:hidden">
                            <Link
                                href="/incidents"
                                className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
                            >
                                সব ঘটনা দেখুন →
                            </Link>
                        </div>
                    </div>
                </section>
            ) : null}

            {/* Data & Patterns */}
            <section className="border-b border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="mb-10">
                        <p className="text-sm font-semibold tracking-wide text-zinc-500">
                            তথ্য ও প্রবণতা
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            জনস্বার্থের তথ্য বিশ্লেষণ
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <div className="mb-3 text-2xl font-bold">
                                {toBengaliNumber(totalIncidents)}
                            </div>

                            <p className="text-sm font-medium text-zinc-500">
                                প্রকাশিত ঘটনা
                            </p>

                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                moderation প্রক্রিয়ার মধ্য দিয়ে গিয়ে
                                অনুমোদিত ও প্রকাশিত মোট ঘটনার সংখ্যা।
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <div className="mb-3 text-2xl font-bold">
                                {toBengaliNumber(totalCategories)}
                            </div>

                            <p className="text-sm font-medium text-zinc-500">
                                ঘটনার শ্রেণি
                            </p>

                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                দুর্নীতি, প্রতারণা, সাইবার অপরাধসহ
                                {toBengaliNumber(totalCategories)}টি শ্রেণিতে
                                ঘটনা রিপোর্ট করা যায়।
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <div className="mb-3 text-2xl font-bold">
                                {toBengaliNumber(totalDivisions)} / {toBengaliNumber(64)}
                            </div>

                            <p className="text-sm font-medium text-zinc-500">
                                বিভাগ / জেলা
                            </p>

                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                বাংলাদেশের {toBengaliNumber(totalDivisions)}টি
                                বিভাগ ও ৬৪টি জেলা জুড়ে ঘটনা খুঁজে পাওয়া
                                যায়।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="border-b border-zinc-200">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold tracking-wide text-zinc-500">
                            কীভাবে কাজ করে
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            তিনটি সহজ ধাপ
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        <div className="border-t-2 border-zinc-950 pt-6">
                            <span className="text-sm font-semibold text-zinc-500">
                                ০১
                            </span>

                            <h3 className="mt-4 text-xl font-bold">
                                রিপোর্ট করুন
                            </h3>

                            <p className="mt-3 leading-7 text-zinc-600">
                                ঘটনার তথ্য, বিভাগ, জেলা এবং প্রয়োজনীয়
                                বিবরণ দিন। পরিচয় প্রকাশ করার প্রয়োজন
                                নেই।
                            </p>
                        </div>

                        <div className="border-t-2 border-zinc-950 pt-6">
                            <span className="text-sm font-semibold text-zinc-500">
                                ০২
                            </span>

                            <h3 className="mt-4 text-xl font-bold">
                                পর্যালোচনা
                            </h3>

                            <p className="mt-3 leading-7 text-zinc-600">
                                আমাদের দল প্রতিটি রিপোর্ট যাচাই করে এবং
                                moderation প্রক্রিয়ায় পর্যালোচনা করে।
                            </p>
                        </div>

                        <div className="border-t-2 border-zinc-950 pt-6">
                            <span className="text-sm font-semibold text-zinc-500">
                                ০৩
                            </span>

                            <h3 className="mt-4 text-xl font-bold">
                                প্রকাশ
                            </h3>

                            <p className="mt-3 leading-7 text-zinc-600">
                                অনুমোদিত রিপোর্ট সবার জন্য প্রকাশিত
                                হয়। জনস্বার্থের তথ্য সবার কাছে
                                পৌঁছায়।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Privacy */}
            <section className="border-b border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="mb-10">
                        <p className="text-sm font-semibold tracking-wide text-zinc-500">
                            নিরাপত্তা ও গোপনীয়তা
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            আপনার তথ্য নিরাপদ
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <div className="mb-3 text-2xl">
                                🔒
                            </div>

                            <h3 className="text-lg font-bold">
                                পরিচয় গোপন
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                রিপোর্ট করার জন্য কোনো account, login,
                                নাম, email বা phone number প্রয়োজন
                                নেই।
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <div className="mb-3 text-2xl">
                                ✅
                            </div>

                            <h3 className="text-lg font-bold">
                                Moderation
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                প্রকাশের আগে প্রতিটি রিপোর্ট যাচাই ও
                                moderation প্রক্রিয়ার মধ্য দিয়ে যায়।
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <div className="mb-3 text-2xl">
                                📋
                            </div>

                            <h3 className="text-lg font-bold">
                                স্বচ্ছতা
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                প্রতিটি রিপোর্টের অবস্থা ও
                                যাচাইকরণ স্ট্যাটাস পরিষ্কারভাবে
                                দেখানো হয়।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="border-b border-zinc-200">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-8">
                        <h2 className="text-lg font-bold text-amber-900">
                            গুরুত্বপূর্ণ বিজ্ঞপ্তি
                        </h2>

                        <div className="mt-4 space-y-3 text-sm leading-7 text-amber-800">
                            <p>
                                OpenWitness-এ প্রকাশিত প্রতিটি রিপোর্ট
                                একটি <strong>প্রতিবেদন</strong> মাত্র,
                                প্রমাণ নয়। রিপোর্ট করা হয়েছে মানে
                                ঘটনাটি সত্য — এই অর্থ বোঝায় না।
                            </p>

                            <p>
                                প্রতিটি রিপোর্ট moderation দল দ্বারা
                                যাচাই করা হয়, তবে এটি সম্পূর্ণ
                                নিশ্চিতকরণ প্রক্রিয়া নয়। পাঠকদের
                                নিজে সিদ্ধান্ত নেওয়ার অনুরোধ করা
                                হয়।
                            </p>

                            <p>
                                মিথ্যা বা বিভ্রান্তিকর রিপোর্ট জমা
                                দেওয়া অবৈধ এবং এর ফলে আইনি
                                ব্যবস্থা নেওয়া হতে পারে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="rounded-3xl bg-zinc-950 px-6 py-14 text-white sm:px-12 lg:px-16">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                আপনার জানা কোনো গুরুত্বপূর্ণ ঘটনা
                                আছে?
                            </h2>

                            <p className="mt-5 text-base leading-7 text-zinc-300 sm:text-lg">
                                পরিচয় প্রকাশ না করেই ঘটনাটি রিপোর্ট
                                করুন। জনস্বার্থের জন্য গুরুত্বপূর্ণ।
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/report"
                                    className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
                                >
                                    রিপোর্ট করুন
                                </Link>

                                <Link
                                    href="/incidents"
                                    className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-7 py-3.5 font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800"
                                >
                                    রিপোর্ট দেখুন
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
