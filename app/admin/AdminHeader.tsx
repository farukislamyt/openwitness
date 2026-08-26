"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type AdminHeaderProps = {
    displayName: string;
    role: string;
};

const NAV_ITEMS = [
    { href: "/admin", label: "ড্যাশবোর্ড" },
    { href: "/admin/reports", label: "রিপোর্ট" },
    { href: "/admin/categories", label: "শ্রেণি" },
    { href: "/admin/users", label: "ব্যবহারকারী" },
];

export default function AdminHeader({
    displayName,
    role,
}: AdminHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
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
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex items-center justify-between py-5">
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

                <nav className="flex gap-1 -mb-px overflow-x-auto pb-px">
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? "border-zinc-950 text-zinc-950"
                                        : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
