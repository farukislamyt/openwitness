"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        if (!confirm("আপনি কি লগআউট করতে চান?")) {
            return;
        }

        setLoggingOut(true);

        try {
            await supabase.auth.signOut();
            router.push("/login");
            router.refresh();
        } catch (logoutError) {
            console.error(
                "[OpenWitness] Logout error:",
                logoutError,
            );
            setLoggingOut(false);
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
        </button>
    );
}
