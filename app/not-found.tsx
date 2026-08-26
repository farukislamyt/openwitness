import Link from "next/link";

export const metadata = {
    title: "পৃষ্ঠা পাওয়া যায়নি",
};

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
            <div className="max-w-md">
                <p className="text-6xl font-bold tracking-tight text-zinc-200">
                    ৪০৪
                </p>

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
                    পৃষ্ঠা পাওয়া যায়নি
                </h1>

                <p className="mt-4 text-base leading-7 text-zinc-600">
                    আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই বা সরিয়ে
                    ফেলা হয়েছে।
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                        হোমে ফিরে যান
                    </Link>

                    <Link
                        href="/incidents"
                        className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                    >
                        প্রকাশিত ঘটনা দেখুন
                    </Link>
                </div>
            </div>
        </main>
    );
}
