"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type AdminHeaderProps = {
    displayName: string;
    role: string;
};

export default function AdminHeader({
    displayName,
    role,
}: AdminHeaderProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
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
        <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight"
                    >
                        OpenWitness
                    </Link>

                    <span className="hidden text-sm font-medium text-zinc-500 sm:inline">
                        প্রশাসনিক প্যানেল
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold">
                            {displayName}
                        </p>
                        <p className="text-xs text-zinc-500">
                            {role === "admin"
                                ? "প্রশাসক"
                                : "মডারেটর"}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loggingOut
                            ? "লগআউট হচ্ছে..."
                            : "লগআউট"}
                    </button>
                </div>
            </div>
        </header>
    );
}
