"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") ?? "");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());

        if (query.trim()) {
            params.set("q", query.trim());
        } else {
            params.delete("q");
        }

        params.delete("page");

        startTransition(() => {
            router.push(`/incidents?${params.toString()}`);
        });
    }

    function handleClear() {
        setQuery("");

        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        params.delete("page");

        startTransition(() => {
            router.push(`/incidents?${params.toString()}`);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ঘটনা খুঁজুন..."
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />

                {query ? (
                    <button
                        type="button"
                        onClick={handleClear}
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
        </form>
    );
}
