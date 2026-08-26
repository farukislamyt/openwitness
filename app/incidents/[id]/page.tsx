import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FlagForm from "./FlagForm";

type IncidentDetail = {
    id: string;
    public_id: string;
    title: string;
    description: string;
    incident_date: string;
    verification_status: string;
    published_at: string;
    category: string | null;
    category_slug: string | null;
    division: string | null;
    division_slug: string | null;
    district: string | null;
    district_slug: string | null;
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

function verificationLabel(status: string): string {
    switch (status) {
        case "reported":
            return "প্রতিবেদিত";
        case "verified":
            return "যাচাইকৃত";
        case "disputed":
            return "বিতর্কিত";
        default:
            return status;
    }
}

function verificationStyles(status: string): string {
    const base =
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

    switch (status) {
        case "verified":
            return `${base} bg-green-100 text-green-800`;
        case "disputed":
            return `${base} bg-red-100 text-red-800`;
        default:
            return `${base} bg-zinc-100 text-zinc-600`;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: incident } = await supabase
        .from("public_incidents")
        .select("title")
        .eq("id", id)
        .maybeSingle();

    return {
        title: incident?.title ?? "ঘটনা পাওয়া যায়নি",
    };
}

export default async function IncidentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: incidentRaw, error: fetchError } = await supabase
        .from("public_incidents")
        .select(
            "id, public_id, title, description, incident_date, verification_status, published_at, category, category_slug, division, division_slug, district, district_slug",
        )
        .eq("id", id)
        .maybeSingle();

    if (fetchError) {
        console.error(
            "[OpenWitness] Incident detail query failed:",
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
        id: incidentRaw.id ?? "",
        public_id: incidentRaw.public_id ?? "",
        title: incidentRaw.title ?? "",
        description: incidentRaw.description ?? "",
        incident_date: incidentRaw.incident_date ?? "",
        verification_status: incidentRaw.verification_status ?? "",
        published_at: incidentRaw.published_at ?? "",
        category: incidentRaw.category,
        category_slug: incidentRaw.category_slug,
        division: incidentRaw.division,
        division_slug: incidentRaw.division_slug,
        district: incidentRaw.district,
        district_slug: incidentRaw.district_slug,
    };

    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <header className="border-b border-zinc-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight"
                    >
                        OpenWitness
                    </Link>

                    <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
                        <Link
                            href="/incidents"
                            className="transition-colors hover:text-zinc-500"
                        >
                            প্রকাশিত ঘটনা
                        </Link>

                        <Link
                            href="/report"
                            className="rounded-full bg-zinc-950 px-5 py-2.5 text-white transition-colors hover:bg-zinc-800"
                        >
                            ঘটনা রিপোর্ট করুন
                        </Link>
                    </nav>

                    <Link
                        href="/report"
                        className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white md:hidden"
                    >
                        রিপোর্ট করুন
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-4xl px-6 py-12 lg:py-20">
                <div className="mb-6">
                    <Link
                        href="/incidents"
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
                    >
                        ← প্রকাশিত ঘটনায় ফিরে যান
                    </Link>
                </div>

                <article>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-zinc-400">
                            {incident.public_id}
                        </span>

                        <span
                            className={verificationStyles(
                                incident.verification_status,
                            )}
                        >
                            {verificationLabel(
                                incident.verification_status,
                            )}
                        </span>
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
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
                        <div className="whitespace-pre-wrap leading-7 text-zinc-700">
                            {incident.description}
                        </div>
                    </div>

                    <div className="mt-8 border-t border-zinc-100 pt-6">
                        <p className="text-xs text-zinc-400">
                            প্রকাশিত:{" "}
                            {formatDateTime(incident.published_at)}
                        </p>
                    </div>
                </article>

                <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                    <FlagForm incidentId={incident.id} />
                </div>
            </section>

            <footer className="border-t border-zinc-200">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                    <p>© {new Date().getFullYear()} OpenWitness</p>

                    <p>
                        বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform
                    </p>
                </div>
            </footer>
        </main>
    );
}
