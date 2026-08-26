"use client";

import { useState } from "react";

type Props = {
    reportId: string;
    action: "dismissed" | "action_taken";
    label: string;
    variant: "primary" | "secondary";
};

export default function ReviewReportButton({
    reportId,
    action,
    label,
    variant,
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleClick() {
        if (!confirm("আপনি কি নিশ্চিত?")) {
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/reports/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, action }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(
                    "[OpenWitness] Report review failed:",
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

    if (error) {
        return (
            <span className="text-xs text-red-600">{error}</span>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isSubmitting}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                variant === "primary"
                    ? "bg-zinc-950 text-white hover:bg-zinc-800"
                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            }`}
        >
            {isSubmitting ? "..." : label}
        </button>
    );
}
