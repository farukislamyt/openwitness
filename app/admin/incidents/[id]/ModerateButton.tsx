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

    async function handleClick() {
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await moderateIncident(incidentId, action);

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
            <button
                onClick={handleClick}
                disabled={loading}
                className={variantStyles}
            >
                {loading ? "প্রক্রিয়া হচ্ছে..." : label}
            </button>

            {error ? (
                <p className="mt-2 text-xs text-red-600">{error}</p>
            ) : null}
        </div>
    );
}
