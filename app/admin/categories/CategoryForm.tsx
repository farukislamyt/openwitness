"use client";

import { useState } from "react";

type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
};

type Props = {
    mode: "create" | "edit";
    category?: Category;
};

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export default function CategoryForm({ mode, category }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(category?.name ?? "");
    const [slug, setSlug] = useState(category?.slug ?? "");
    const [description, setDescription] = useState(
        category?.description ?? "",
    );
    const [isActive, setIsActive] = useState(category?.is_active ?? true);
    const [sortOrder, setSortOrder] = useState(
        category?.sort_order ?? 0,
    );
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newName = e.target.value;
        setName(newName);

        if (mode === "create") {
            setSlug(slugify(newName));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("নাম প্রয়োজন।");
            return;
        }

        if (!slug.trim()) {
            setError("স্লাগ প্রয়োজন।");
            return;
        }

        setIsSubmitting(true);

        try {
            const url =
                mode === "create"
                    ? "/api/admin/categories"
                    : `/api/admin/categories/${category?.id}`;

            const method = mode === "create" ? "POST" : "PATCH";

            const body =
                mode === "create"
                    ? { name, slug, description, is_active: isActive, sort_order: sortOrder }
                    : { name, slug, description, is_active: isActive, sort_order: sortOrder };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(
                    "[OpenWitness] Category save failed:",
                    JSON.stringify(data, null, 2),
                );
                setError(data.error ?? "একটি ত্রুটি ঘটেছে।");
                return;
            }

            window.location.reload();
        } catch {
            setError("নেটওয়ার্ক ত্রুটি।");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === "create"
                        ? "bg-zinc-950 text-white hover:bg-zinc-800"
                        : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
            >
                {mode === "create" ? "+ নতুন শ্রেণি" : "সম্পাদনা"}
            </button>
        );
    }

    return (
        <div
            className={`${
                mode === "edit"
                    ? "inline-block"
                    : "rounded-2xl border border-zinc-200 bg-white p-6"
            }`}
        >
            {mode === "create" ? (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                        নতুন শ্রেণি তৈরি করুন
                    </h3>
                </div>
            ) : null}

            <div className={mode === "edit" ? "" : ""}>
                {mode === "edit" ? (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="mb-3 text-sm text-zinc-500 hover:text-zinc-950"
                    >
                        বাতিল
                    </button>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            নাম *
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                            placeholder="শ্রেণির নাম"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            স্লাগ *
                        </label>

                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                            placeholder="category-slug"
                        />

                        <p className="mt-1 text-xs text-zinc-400">
                            URL-এ ব্যবহৃত হবে।
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            বিবরণ (ঐচ্ছিক)
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                            placeholder="শ্রেণির সংক্ষিপ্ত বিবরণ"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) =>
                                    setIsActive(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-zinc-300"
                            />

                            <span className="text-sm text-zinc-700">
                                সক্রিয়
                            </span>
                        </label>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-zinc-700">
                                ক্রম:
                            </label>

                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(Number(e.target.value))
                                }
                                className="w-20 rounded-xl border border-zinc-200 px-3 py-1.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                            />
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "সংরক্ষণ হচ্ছে..."
                                : mode === "create"
                                  ? "তৈরি করুন"
                                  : "সংরক্ষণ করুন"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                        >
                            বাতিল
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
