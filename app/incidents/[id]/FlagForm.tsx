"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Reason = {
    value: string;
    label: string;
};

const REASONS: Reason[] = [
    { value: "personal_information", label: "ব্যক্তিগত তথ্য" },
    { value: "false_or_misleading", label: "মিথ্যা বা বিভ্রান্তিকর" },
    { value: "harassment_or_hate", label: "হয়রানি বা ঘৃণা" },
    { value: "threat_or_violence", label: "হুমুকি বা সহিংসতা" },
    { value: "duplicate", label: "ডুপ্লিকেট" },
    { value: "other", label: "অন্যান্য" },
];

export default function FlagForm({ incidentId }: { incidentId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!selectedReason) {
            setError("অনুগ্রহ করে একটি কারণ নির্বাচন করুন।");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: insertError } = await supabase
                .from("incident_reports")
                .insert({
                    incident_id: incidentId,
                    reason: selectedReason as
                        | "personal_information"
                        | "false_or_misleading"
                        | "harassment_or_hate"
                        | "threat_or_violence"
                        | "duplicate"
                        | "other",
                    description: description.trim() || null,
                });

            if (insertError) {
                console.error(
                    "[OpenWitness] Flag submission failed:",
                    JSON.stringify(
                        {
                            code: insertError.code,
                            message: insertError.message,
                            details: insertError.details,
                            hint: insertError.hint,
                        },
                        null,
                        2,
                    ),
                );

                if (insertError.code === "23505") {
                    setError("আপনি ইতিমধ্যে এই ঘটনাটি রিপোর্ট করেছেন।");
                } else {
                    setError("রিপোর্ট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।");
                }

                return;
            }

            setIsSubmitted(true);
        } catch {
            setError("একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                </div>

                <h3 className="mt-3 text-lg font-semibold">
                    রিপোর্ট জমা হয়েছে
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                    আপনার রিপোর্ট পর্যালোচনা করা হবে। ধন্যবাদ।
                </p>

                <button
                    onClick={() => {
                        setIsOpen(false);
                        setSelectedReason("");
                        setDescription("");
                        setIsSubmitted(false);
                    }}
                    className="mt-4 text-sm font-medium text-zinc-600 hover:text-zinc-950"
                >
                    আবার রিপোর্ট করুন
                </button>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
                <span className="text-base">⚑</span>
                এই ঘটনাটি রিপোর্ট করুন
            </button>
        );
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">ঘটনা রিপোর্ট</h3>

                <button
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-zinc-500 hover:text-zinc-950"
                >
                    বাতিল
                </button>
            </div>

            <p className="mb-5 text-sm text-zinc-500">
                এই ঘটনাটি সম্পর্কে আপনার উদ্বেগ জানান।
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                        রিপোর্টের কারণ *
                    </label>

                    <div className="space-y-2">
                        {REASONS.map((reason) => (
                            <label
                                key={reason.value}
                                className={`flex cursor-pointer items-center rounded-xl border p-3 transition ${
                                    selectedReason === reason.value
                                        ? "border-zinc-950 bg-zinc-50"
                                        : "border-zinc-200 hover:border-zinc-300"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reason.value}
                                    checked={
                                        selectedReason === reason.value
                                    }
                                    onChange={(e) =>
                                        setSelectedReason(
                                            e.target.value,
                                        )
                                    }
                                    className="sr-only"
                                />

                                <span
                                    className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                        selectedReason === reason.value
                                            ? "border-zinc-950"
                                            : "border-zinc-300"
                                    }`}
                                >
                                    {selectedReason === reason.value ? (
                                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-950" />
                                    ) : null}
                                </span>

                                <span className="text-sm">
                                    {reason.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="flag-description"
                        className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                        বিবরণ (ঐচ্ছিক)
                    </label>

                    <textarea
                        id="flag-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="অতিরিক্ত বিবরণ দিন..."
                        maxLength={3000}
                        className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-950 transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />

                    <p className="mt-1 text-right text-xs text-zinc-400">
                        {description.length} / 3000
                    </p>
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                >
                    {isSubmitting ? "জমা হচ্ছে..." : "রিপোর্ট জমা দিন"}
                </button>
            </form>
        </div>
    );
}
