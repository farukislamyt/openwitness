"use client";

import Link from "next/link";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
            <div className="max-w-md">
                <p className="text-6xl font-bold tracking-tight text-zinc-200">
                    ৫০০
                </p>

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
                    কিছু ভুল হয়েছে
                </h1>

                <p className="mt-4 text-base leading-7 text-zinc-600">
                    একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে
                    আবার চেষ্টা করুন।
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                        আবার চেষ্টা করুন
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                    >
                        হোমে ফিরে যান
                    </Link>
                </div>
            </div>
        </main>
    );
}
