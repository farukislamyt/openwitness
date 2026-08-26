"use client";

import { useState } from "react";

type AdminUser = {
    id: string;
    display_name: string;
    role: string;
    is_active: boolean;
};

type Props = {
    mode: "create" | "edit";
    user?: AdminUser;
};

export default function AdminUserForm({ mode, user }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [displayName, setDisplayName] = useState(user?.display_name ?? "");
    const [role, setRole] = useState(user?.role ?? "moderator");
    const [isActive, setIsActive] = useState(user?.is_active ?? true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!displayName.trim()) {
            setError("নাম প্রয়োজন।");
            return;
        }

        setIsSubmitting(true);

        try {
            const url =
                mode === "create"
                    ? "/api/admin/users"
                    : `/api/admin/users/${user?.id}`;

            const method = mode === "create" ? "POST" : "PATCH";

            const body =
                mode === "create"
                    ? { display_name: displayName, role, is_active: isActive }
                    : { display_name: displayName, role, is_active: isActive };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(
                    "[OpenWitness] Admin user save failed:",
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
                {mode === "create" ? "+ নতুন ব্যবহারকারী" : "সম্পাদনা"}
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
                        নতুন ব্যবহারকারী যোগ করুন
                    </h3>
                </div>
            ) : null}

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
                        প্রদর্শন নাম *
                    </label>

                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                        placeholder="ব্যবহারকারীর নাম"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                        ভূমিকা
                    </label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    >
                        <option value="moderator">মডারেটর</option>
                        <option value="admin">অ্যাডমিন</option>
                    </select>

                    <p className="mt-1 text-xs text-zinc-400">
                        মডারেটর: রিপোর্ট পর্যালোচনা ও অনুমোদন। অ্যাডমিন:
                        সব কিছু।
                    </p>
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300"
                    />

                    <span className="text-sm text-zinc-700">সক্রিয়</span>
                </label>

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
    );
}
