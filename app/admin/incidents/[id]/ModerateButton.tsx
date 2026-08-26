"use client";

import { useState } from "react";
import { moderateIncident } from "@/lib/actions/moderate";

type ModerateButtonProps = {
    incidentId: string;
    action: "approved" | "rejected";
    label: string;
    variant: "success" | "danger";
};

export default function ModerateButton({
    incidentId,
    action,
    label,
    variant,
}: ModerateButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notes, setNotes] = useState("");
    const [showNotes, setShowNotes] = useState(false);

    const confirmMessage =
        action === "approved"
            ? "আপনি কি নিশ্চিত এই রিপোর্টটি অনুমোদন করতে চান?"
            : "আপনি কি নিশ্চিত এই রিপোর্টটি প্রত্যাখ্যান করতে চান?";

    const baseStyles =
        "w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

    const variantStyles =
        variant === "success"
            ? `${baseStyles} bg-green-600 text-white hover:bg-green-700`
            : `${baseStyles} bg-red-600 text-white hover:bg-red-700`;

    async function handleSubmit() {
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await moderateIncident(
                incidentId,
                action,
                notes.trim() || undefined,
            );

            if (!result.success && result.error) {
                setError(result.error);
                setLoading(false);
            }
        } catch (moderationError) {
            console.error(
                "[OpenWitness] Moderation error:",
                moderationError,
            );
            setError("একটি অপ্রত্যাশিত সমস্যা হয়েছে।");
            setLoading(false);
        }
    }

    return (
        <div>
            {showNotes ? (
                <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                        নোট (ঐচ্ছিক)
                    </label>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        maxLength={5000}
                        placeholder="পর্যালোচনার নোট লিখুন..."
                        className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-2.5 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />

                    <p className="mt-1 text-right text-xs text-zinc-400">
                        {notes.length} / 5000
                    </p>
                </div>
            ) : null}

            <div className="flex gap-2">
                {!showNotes ? (
                    <button
                        type="button"
                        onClick={() => setShowNotes(true)}
                        className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                        নোট যোগ করুন
                    </button>
                ) : null}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={variantStyles}
                >
                    {loading ? "প্রক্রিয়া হচ্ছে..." : label}
                </button>
            </div>

            {error ? (
                <p className="mt-2 text-xs text-red-600">{error}</p>
            ) : null}
        </div>
    );
}
