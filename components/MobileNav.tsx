"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100"
                aria-label={isOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            >
                {isOpen ? (
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 9h16.5m-16.5 6.75h16.5"
                        />
                    </svg>
                )}
            </button>

            {isOpen ? (
                <div className="absolute inset-x-0 top-full z-50 border-b border-zinc-200 bg-white shadow-lg">
                    <nav className="mx-auto max-w-7xl px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <Link
                                href="/incidents"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                প্রকাশিত ঘটনা
                            </Link>

                            <Link
                                href="/how-it-works"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                কীভাবে কাজ করে
                            </Link>

                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                আমাদের সম্পর্কে
                            </Link>

                            <div className="my-2 border-t border-zinc-100" />

                            <Link
                                href="/report"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg bg-zinc-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
                            >
                                রিপোর্ট করুন
                            </Link>
                        </div>
                    </nav>
                </div>
            ) : null}
        </div>
    );
}
