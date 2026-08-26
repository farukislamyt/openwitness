import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
    title: "কীভাবে কাজ করে",
    description:
        "OpenWitness কীভাবে কাজ করে — রিপোর্ট থেকে প্রকাশ পর্যন্ত।",
};

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <SiteHeader />

            <section className="border-b border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
                    <Link
                        href="/"
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
                    >
                        ← হোমে ফিরে যান
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                        কীভাবে কাজ করে
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg text-zinc-600">
                        রিপোর্ট জমা দেওয়া থেকে প্রকাশ পর্যন্ত
                        সম্পূর্ণ প্রক্রিয়া।
                    </p>
                </div>
            </section>

            <section>
                <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
                    <div className="space-y-16">
                        {/* Step 1 */}
                        <div className="flex gap-6">
                            <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-lg font-bold text-white">
                                    ১
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    রিপোর্ট জমা দিন
                                </h2>

                                <div className="mt-4 space-y-3 text-zinc-700">
                                    <p>
                                        ঘটনার শিরোনাম, বিবরণ,
                                        শ্রেণি, বিভাগ, জেলা এবং
                                        ঘটনার তারিখ দিন।
                                    </p>

                                    <p>
                                        <strong>পরিচয় প্রয়োজন
                                        নেই।</strong> কোনো account,
                                        login, নাম, email বা phone
                                        number দিতে হবে না।
                                    </p>

                                    <p>
                                        আপনার রিপোর্ট
                                        <strong> অপেক্ষমাণ
                                        (pending)</strong> অবস্থায়
                                        সংরক্ষিত হবে।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-6">
                            <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-lg font-bold text-white">
                                    ২
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Moderation ও যাচাই
                                </h2>

                                <div className="mt-4 space-y-3 text-zinc-700">
                                    <p>
                                        আমাদের moderation দল প্রতিটি
                                        রিপোর্ট পর্যালোচনা করে।
                                    </p>

                                    <p>
                                        পর্যালোচনায় যাচাই করা হয়:
                                    </p>

                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>
                                            রিপোর্টটি জনস্বার্থ
                                            সংশ্লিষ্ট কি?
                                        </li>

                                        <li>
                                            বিবরণ পর্যাপ্ত ও
                                            স্পষ্ট কি?
                                        </li>

                                        <li>
                                            শ্রেণি ও অবস্থান
                                            সঠিক কি?
                                        </li>

                                        <li>
                                            কোনো ব্যক্তিগত তথ্য
                                            অনাবশ্যকভাবে আছে কি?
                                        </li>
                                    </ul>

                                    <p>
                                        পর্যালোচনার ফলাফল:
                                    </p>

                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>
                                            <strong>অনুমোদিত
                                            (Approved):</strong>{" "}
                                            রিপোর্ট প্রকাশিত হবে।
                                        </li>

                                        <li>
                                            <strong>সংশোধন প্রয়োজন
                                            (Needs Revision):</strong>{" "}
                                            সংশোধনের জন্য ফেরত
                                            দেওয়া হবে।
                                        </li>

                                        <li>
                                            <strong>প্রত্যাখ্যাত
                                            (Rejected):</strong>{" "}
                                            রিপোর্ট প্রকাশিত হবে না।
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-6">
                            <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-lg font-bold text-white">
                                    ৩
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    প্রকাশ
                                </h2>

                                <div className="mt-4 space-y-3 text-zinc-700">
                                    <p>
                                        অনুমোদিত রিপোর্ট
                                        <strong> প্রকাশিত
                                        (Published)</strong> হয় এবং
                                        সবার জন্য দৃশ্যমান হয়।
                                    </p>

                                    <p>
                                        প্রকাশিত রিপোর্টে থাকে:
                                    </p>

                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>
                                            শিরোনাম ও বিবরণ
                                        </li>

                                        <li>
                                            শ্রেণি ও অবস্থান
                                        </li>

                                        <li>
                                            ঘটনার তারিখ
                                        </li>

                                        <li>
                                            যাচাইকরণ স্ট্যাটাস
                                        </li>

                                        <li>
                                            প্রকাশের তারিখ
                                        </li>
                                    </ul>

                                    <p>
                                        <strong>পরিচয় কখনোই
                                        প্রকাশিত হয় না।</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status tracking */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
                            <h2 className="text-xl font-bold">
                                রিপোর্ট অবস্থা
                            </h2>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                        নতুন
                                    </span>

                                    <span className="text-sm text-zinc-600">
                                        রিপোর্ট জমা দেওয়া হয়েছে,
                                        পর্যালোচনার অপেক্ষায়।
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                                        পর্যালোচনাধীন
                                    </span>

                                    <span className="text-sm text-zinc-600">
                                        moderation দল রিপোর্টটি
                                        পর্যালোচনা করছে।
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                                        অনুমোদিত
                                    </span>

                                    <span className="text-sm text-zinc-600">
                                        রিপোর্ট প্রকাশিত হয়েছে।
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                                        প্রত্যাখ্যাত
                                    </span>

                                    <span className="text-sm text-zinc-600">
                                        রিপোর্ট প্রকাশযোগ্য নয়।
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
