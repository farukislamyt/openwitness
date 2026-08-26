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
    { href: "/admin", label: "ড্যাশবোর্ড", exact: true },
    { href: "/admin/incidents", label: "সব রিপোর্ট" },
    { href: "/admin/incidents/pending", label: "অপেক্ষমাণ" },
    { href: "/admin/incidents/approved", label: "অনুমোদিত" },
    { href: "/admin/incidents/rejected", label: "প্রত্যাখ্যাত" },
    { href: "/admin/reports", label: "ফ্ল্যাগ" },
    { href: "/admin/categories", label: "শ্রেণি" },
    { href: "/admin/locations", label: "অবস্থান" },
    { href: "/admin/audit", label: "অডিট" },
    { href: "/admin/profile", label: "প্রোফাইল" },
];

export default function AdminHeader({
    displayName,
    role,
}: AdminHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-2xl font-bold tracking-tight"
                        >
                            OpenWitness
                        </Link>

                        <span className="hidden text-sm font-medium text-zinc-400 sm:inline">
                            প্রশাসন
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="hidden text-sm text-zinc-500 hover:text-zinc-950 sm:inline"
                        >
                            সাইট দেখুন
                        </Link>

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

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg border border-zinc-200 p-2 text-zinc-500 sm:hidden"
                            aria-label="মেনু"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <nav className="hidden gap-1 -mb-px overflow-x-auto pb-px sm:flex">
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition ${
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

            {mobileMenuOpen ? (
                <nav className="border-t border-zinc-200 bg-white px-6 py-4 sm:hidden">
                    <div className="flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-zinc-100 text-zinc-950"
                                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="my-2 border-t border-zinc-200" />

                        <Link
                            href="/"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            সাইট দেখুন
                        </Link>
                    </div>
                </nav>
            ) : null}
        </header>
    );
}
