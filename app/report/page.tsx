"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Division = Database["public"]["Tables"]["divisions"]["Row"];
type District = Database["public"]["Tables"]["districts"]["Row"];

type FormState = {
    categoryId: string;
    divisionId: string;
    districtId: string;
    incidentDate: string;
    title: string;
    description: string;
};

const initialForm: FormState = {
    categoryId: "",
    divisionId: "",
    districtId: "",
    incidentDate: "",
    title: "",
    description: "",
};

/**
 * Returns today's calendar date in Bangladesh time.
 *
 * Format:
 * YYYY-MM-DD
 */
function getDhakaToday(): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function getSupabaseErrorInfo(error: {
    message?: string;
    details?: string;
    hint?: string;
    code?: string;
}) {
    return {
        message: error.message || "Unknown database error",
        details: error.details || "No additional details",
        hint: error.hint || "No hint",
        code: error.code || "UNKNOWN",
    };
}

export default function ReportPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);

    const [form, setForm] = useState<FormState>(initialForm);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [successId, setSuccessId] = useState("");

    const today = getDhakaToday();

    useEffect(() => {
        let cancelled = false;

        async function loadReferenceData() {
            setLoading(true);
            setError("");

            const [
                categoriesResult,
                divisionsResult,
                districtsResult,
            ] = await Promise.all([
                supabase
                    .from("categories")
                    .select("*")
                    .eq("is_active", true)
                    .order("sort_order", { ascending: true })
                    .order("name", { ascending: true }),

                supabase
                    .from("divisions")
                    .select("*")
                    .order("sort_order", { ascending: true })
                    .order("name", { ascending: true }),

                supabase
                    .from("districts")
                    .select("*")
                    .order("division_id", { ascending: true })
                    .order("sort_order", { ascending: true })
                    .order("name", { ascending: true }),
            ]);

            if (cancelled) {
                return;
            }

            if (categoriesResult.error) {
                const info = getSupabaseErrorInfo(
                    categoriesResult.error,
                );

                console.error(
                    "[OpenWitness] Categories query failed:",
                    JSON.stringify(info, null, 2),
                );
            }

            if (divisionsResult.error) {
                const info = getSupabaseErrorInfo(
                    divisionsResult.error,
                );

                console.error(
                    "[OpenWitness] Divisions query failed:",
                    JSON.stringify(info, null, 2),
                );
            }

            if (districtsResult.error) {
                const info = getSupabaseErrorInfo(
                    districtsResult.error,
                );

                console.error(
                    "[OpenWitness] Districts query failed:",
                    JSON.stringify(info, null, 2),
                );
            }

            const firstError =
                categoriesResult.error ??
                divisionsResult.error ??
                districtsResult.error;

            if (firstError) {
                setError(
                    "তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
                );
                setLoading(false);
                return;
            }

            setCategories(categoriesResult.data ?? []);
            setDivisions(divisionsResult.data ?? []);
            setDistricts(districtsResult.data ?? []);

            console.info("[OpenWitness] Reference data loaded:", {
                categories: categoriesResult.data?.length ?? 0,
                divisions: divisionsResult.data?.length ?? 0,
                districts: districtsResult.data?.length ?? 0,
            });

            setLoading(false);
        }

        void loadReferenceData();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredDistricts = useMemo(() => {
        if (!form.divisionId) {
            return [];
        }

        const divisionId = Number(form.divisionId);

        return districts.filter(
            (district) => district.division_id === divisionId,
        );
    }, [districts, form.divisionId]);

    function updateField<K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setError("");
        setSuccessId("");
    }

    function handleDivisionChange(value: string) {
        setForm((current) => ({
            ...current,
            divisionId: value,
            districtId: "",
        }));

        setError("");
        setSuccessId("");
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setSuccessId("");

        if (
            !form.categoryId ||
            !form.divisionId ||
            !form.districtId ||
            !form.incidentDate ||
            !form.title.trim() ||
            !form.description.trim()
        ) {
            setError(
                "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।",
            );
            return;
        }

        /*
         * Incident dates cannot be in the future according
         * to the Bangladesh calendar.
         */
        const currentDhakaDate = getDhakaToday();

        if (form.incidentDate > currentDhakaDate) {
            setError(
                "ঘটনার তারিখ ভবিষ্যতের তারিখ হতে পারে না।",
            );
            return;
        }

        /*
         * Database constraint:
         *
         * 20 <= char_length(TRIM(description)) <= 10000
         *
         * Validate it here first so users get a clear message
         * instead of a PostgreSQL constraint error.
         */
        const trimmedDescription = form.description.trim();

        if (trimmedDescription.length < 20) {
            setError(
                "ঘটনার বিস্তারিত বিবরণ কমপক্ষে ২০ অক্ষরের হতে হবে।",
            );
            return;
        }

        if (trimmedDescription.length > 10000) {
            setError(
                "ঘটনার বিস্তারিত বিবরণ সর্বোচ্চ ১০,০০০ অক্ষরের হতে পারে।",
            );
            return;
        }

        const trimmedTitle = form.title.trim();

        const categoryId = form.categoryId;
        const divisionId = Number(form.divisionId);
        const districtId = Number(form.districtId);

        const selectedCategory = categories.find(
            (category) => category.id === categoryId,
        );

        if (!selectedCategory) {
            setError("নির্বাচিত ঘটনার শ্রেণি সঠিক নয়।");
            return;
        }

        const selectedDistrict = districts.find(
            (district) => district.id === districtId,
        );

        if (!selectedDistrict) {
            setError("নির্বাচিত জেলা সঠিক নয়।");
            return;
        }

        if (selectedDistrict.division_id !== divisionId) {
            setError(
                "নির্বাচিত বিভাগ ও জেলার মধ্যে মিল নেই।",
            );
            return;
        }

        const publicId = crypto.randomUUID();

        const insertPayload = {
            category_id: categoryId,
            division_id: divisionId,
            district_id: districtId,
            incident_date: form.incidentDate,
            public_id: publicId,
            title: trimmedTitle,
            description: trimmedDescription,
        };

        setSubmitting(true);

        try {
            console.info("[OpenWitness] Submitting incident:", {
                category_id: insertPayload.category_id,
                division_id: insertPayload.division_id,
                district_id: insertPayload.district_id,
                incident_date: insertPayload.incident_date,
                dhaka_today: currentDhakaDate,
                public_id: insertPayload.public_id,
                title_length: insertPayload.title.length,
                description_length:
                    insertPayload.description.length,
            });

            /*
             * INSERT ONLY.
             *
             * Do not use .select() here.
             *
             * Newly submitted incidents are pending and anonymous
             * users are intentionally not allowed to SELECT pending
             * incidents under the current RLS policy.
             */
            const { error: insertError } = await supabase
                .from("incidents")
                .insert(insertPayload);

            if (insertError) {
                const info = getSupabaseErrorInfo(insertError);

                console.error(
                    "[OpenWitness] Incident submission failed:",
                    JSON.stringify(info, null, 2),
                );

                console.error(
                    "[OpenWitness] Incident submission error code:",
                    info.code,
                );

                console.error(
                    "[OpenWitness] Incident submission error message:",
                    info.message,
                );

                console.error(
                    "[OpenWitness] Incident submission error details:",
                    info.details,
                );

                console.error(
                    "[OpenWitness] Incident submission error hint:",
                    info.hint,
                );

                setError(
                    `রিপোর্ট জমা দেওয়া যায়নি: ${info.code} — ${info.message}`,
                );

                return;
            }

            console.info(
                "[OpenWitness] Incident submitted successfully:",
                publicId,
            );

            setSuccessId(publicId);
            setForm(initialForm);
        } catch (submissionError) {
            console.error(
                "[OpenWitness] Unexpected submission error:",
                submissionError,
            );

            setError(
                "রিপোর্ট জমা দেওয়ার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে।",
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (successId) {
        return (
            <main className="min-h-screen bg-white text-zinc-950">
                <header className="border-b border-zinc-200">
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
                        <Link
                            href="/"
                            className="text-2xl font-bold tracking-tight"
                        >
                            OpenWitness
                        </Link>

                        <Link
                            href="/incidents"
                            className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
                        >
                            প্রকাশিত ঘটনা
                        </Link>
                    </div>
                </header>

                <section className="mx-auto max-w-2xl px-6 py-20 lg:py-28">
                    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-xl text-white">
                            ✓
                        </div>

                        <h1 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                            রিপোর্ট সফলভাবে জমা হয়েছে
                        </h1>

                        <p className="mt-5 leading-8 text-zinc-600">
                            আপনার রিপোর্টটি moderation-এর জন্য পাঠানো হয়েছে।
                            অনুমোদিত হলে এটি OpenWitness-এ প্রকাশিত হবে।
                        </p>

                        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
                            <p className="text-sm text-zinc-500">
                                রিপোর্টের রেফারেন্স
                            </p>

                            <p className="mt-2 break-all font-mono text-sm font-semibold">
                                {successId}
                            </p>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-zinc-500">
                            এই রেফারেন্সটি সংরক্ষণ করে রাখতে পারেন।
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 font-semibold text-white hover:bg-zinc-800"
                            >
                                হোমে ফিরে যান
                            </Link>

                            <Link
                                href="/incidents"
                                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 font-semibold hover:bg-zinc-100"
                            >
                                প্রকাশিত ঘটনা দেখুন
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <header className="border-b border-zinc-200">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight"
                    >
                        OpenWitness
                    </Link>

                    <Link
                        href="/incidents"
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
                    >
                        প্রকাশিত ঘটনা
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-4xl px-6 py-12 lg:py-20">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold tracking-wide text-zinc-500">
                        বেনামে রিপোর্ট করুন
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                        একটি ঘটনা রিপোর্ট করুন
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-600">
                        জনস্বার্থ সংশ্লিষ্ট কোনো ঘটনা আমাদের জানান। রিপোর্ট করার
                        জন্য আপনার কোনো account, নাম, email বা phone number
                        প্রয়োজন নেই।
                    </p>
                </div>

                <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                    {loading ? (
                        <div className="py-12 text-center text-zinc-500">
                            তথ্য লোড হচ্ছে...
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >
                            {error ? (
                                <div
                                    role="alert"
                                    className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                                >
                                    {error}
                                </div>
                            ) : null}

                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-semibold"
                                >
                                    ঘটনার শ্রেণি
                                </label>

                                <select
                                    id="category"
                                    value={form.categoryId}
                                    onChange={(event) =>
                                        updateField(
                                            "categoryId",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                                >
                                    <option value="">
                                        শ্রেণি নির্বাচন করুন
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="division"
                                        className="block text-sm font-semibold"
                                    >
                                        বিভাগ
                                    </label>

                                    <select
                                        id="division"
                                        value={form.divisionId}
                                        onChange={(event) =>
                                            handleDivisionChange(
                                                event.target.value,
                                            )
                                        }
                                        required
                                        className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                                    >
                                        <option value="">
                                            বিভাগ নির্বাচন করুন
                                        </option>

                                        {divisions.map((division) => (
                                            <option
                                                key={division.id}
                                                value={division.id}
                                            >
                                                {division.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="district"
                                        className="block text-sm font-semibold"
                                    >
                                        জেলা
                                    </label>

                                    <select
                                        id="district"
                                        value={form.districtId}
                                        onChange={(event) =>
                                            updateField(
                                                "districtId",
                                                event.target.value,
                                            )
                                        }
                                        required
                                        disabled={!form.divisionId}
                                        className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:bg-zinc-100 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                                    >
                                        <option value="">
                                            {form.divisionId
                                                ? "জেলা নির্বাচন করুন"
                                                : "আগে বিভাগ নির্বাচন করুন"}
                                        </option>

                                        {filteredDistricts.map((district) => (
                                            <option
                                                key={district.id}
                                                value={district.id}
                                            >
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="incidentDate"
                                    className="block text-sm font-semibold"
                                >
                                    ঘটনার তারিখ
                                </label>

                                <input
                                    id="incidentDate"
                                    type="date"
                                    value={form.incidentDate}
                                    max={today}
                                    onChange={(event) =>
                                        updateField(
                                            "incidentDate",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                                />

                                <p className="mt-2 text-xs text-zinc-500">
                                    ভবিষ্যতের তারিখ নির্বাচন করা যাবে না।
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-semibold"
                                >
                                    ঘটনার শিরোনাম
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    value={form.title}
                                    onChange={(event) =>
                                        updateField(
                                            "title",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    maxLength={200}
                                    placeholder="সংক্ষেপে ঘটনার শিরোনাম লিখুন"
                                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                                />

                                <p className="mt-2 text-xs text-zinc-500">
                                    সর্বোচ্চ ২০০ অক্ষর
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-semibold"
                                >
                                    ঘটনার বিস্তারিত বিবরণ
                                </label>

                                <textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(event) =>
                                        updateField(
                                            "description",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    minLength={20}
                                    maxLength={10000}
                                    rows={8}
                                    placeholder="ঘটনাটি কীভাবে ঘটেছে, কোথায় ঘটেছে এবং জনস্বার্থে কেন গুরুত্বপূর্ণ—বিস্তারিত লিখুন।"
                                    className="mt-2 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 leading-7 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                                />

                                <div className="mt-2 flex justify-between text-xs text-zinc-500">
                                    <span>
                                        কমপক্ষে ২০ অক্ষর
                                    </span>

                                    <span>
                                        {form.description.length.toLocaleString(
                                            "en-US",
                                        )}{" "}
                                        / 10,000
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-zinc-50 p-5">
                                <p className="text-sm font-semibold">
                                    আপনার গোপনীয়তা
                                </p>

                                <p className="mt-2 text-sm leading-6 text-zinc-600">
                                    এই ফর্মে আপনার নাম, email, phone number বা কোনো
                                    account-এর তথ্য চাওয়া হচ্ছে না।
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-7 py-3.5 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting
                                    ? "রিপোর্ট জমা হচ্ছে..."
                                    : "রিপোর্ট জমা দিন"}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}