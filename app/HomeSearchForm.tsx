"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = { name: string; slug: string };
type Division = { name: string; slug: string };

export default function HomeSearchForm({
    categories,
    divisions,
}: {
    categories: Category[];
    divisions: Division[];
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [division, setDivision] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const sp = new URLSearchParams();
        if (query.trim()) sp.set("q", query.trim());
        if (category) sp.set("category", category);
        if (division) sp.set("division", division);

        const qs = sp.toString();
        router.push(qs ? `/incidents?${qs}` : "/incidents");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
        >
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ঘটনা খুঁজুন..."
                    className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />

                <button
                    type="submit"
                    className="rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                    খুঁজুন
                </button>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                    <option value="">সব শ্রেণি</option>
                    {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                    <option value="">সব বিভাগ</option>
                    {divisions.map((d) => (
                        <option key={d.slug} value={d.slug}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    );
}
