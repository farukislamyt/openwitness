import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
    title: "লগইন",
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <header className="border-b border-zinc-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight"
                        aria-label="OpenWitness হোম"
                    >
                        OpenWitness
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-md">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold tracking-wide text-zinc-500">
                            প্রশাসনিক প্যানেল
                        </p>

                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                            লগইন
                        </h1>
                    </div>

                    <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                        <Suspense
                            fallback={
                                <div className="py-12 text-center text-zinc-500">
                                    লোড হচ্ছে...
                                </div>
                            }
                        >
                            <LoginForm />
                        </Suspense>
                    </div>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        <Link
                            href="/"
                            className="font-semibold text-zinc-950 hover:text-zinc-600"
                        >
                            হোমে ফিরে যান
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
