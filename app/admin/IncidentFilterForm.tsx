"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function IncidentFilterForm({
    basePath,
    categoryOptions,
    divisionOptions,
}: {
    basePath: string;
    categoryOptions: { value: string; label: string }[];
    divisionOptions: { value: string; label: string }[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") ?? "");
    const [category, setCategory] = useState(searchParams.get("category") ?? "");
    const [division, setDivision] = useState(searchParams.get("division") ?? "");
    const [dateFrom, setDateFrom] = useState(searchParams.get("date_from") ?? "");
    const [dateTo, setDateTo] = useState(searchParams.get("date_to") ?? "");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams();

        const status = searchParams.get("status");
        if (status) params.set("status", status);
        if (query.trim()) params.set("q", query.trim());
        if (category) params.set("category", category);
        if (division) params.set("division", division);
        if (dateFrom) params.set("date_from", dateFrom);
        if (dateTo) params.set("date_to", dateTo);

        startTransition(() => {
            router.push(`${basePath}?${params.toString()}`);
        });
    }

    function handleClear() {
        setQuery("");
        setCategory("");
        setDivision("");
        setDateFrom("");
        setDateTo("");

        const params = new URLSearchParams();
        const status = searchParams.get("status");
        if (status) params.set("status", status);

        startTransition(() => {
            router.push(`${basePath}?${params.toString()}`);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="পাবলিক আইডি বা শিরোনাম..."
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />

                    {query ? (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                            ✕
                        </button>
                    ) : null}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                >
                    {isPending ? "..." : "খুঁজুন"}
                </button>

                {(query || category || division || dateFrom || dateTo) ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
                    >
                        মুছুন
                    </button>
                ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
                {categoryOptions.length > 1 ? (
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    >
                        <option value="">সব শ্রেণি</option>
                        {categoryOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : null}

                {divisionOptions.length > 1 ? (
                    <select
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    >
                        <option value="">সব বিভাগ</option>
                        {divisionOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : null}

                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="থেকে"
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />

                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="পর্যন্ত"
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
        </form>
    );
}
