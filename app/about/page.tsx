import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
    title: "আমাদের সম্পর্কে",
    description:
        "OpenWitness সম্পর্কে জানুন — বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform। পরিচয় প্রকাশ না করেই ঘটনা রিপোর্ট করুন।",
    openGraph: {
        title: "আমাদের সম্পর্কে | OpenWitness",
        description:
            "OpenWitness সম্পর্কে জানুন — বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform।",
        url: "https://openwitness.vercel.app/about",
    },
    alternates: {
        canonical: "/about",
    },
};

export default function AboutPage() {
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
                        OpenWitness সম্পর্কে
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg text-zinc-600">
                        বাংলাদেশের জনস্বার্থের ঘটনা নথিভুক্ত করার
                        একটি মুক্ত, নিরাপদ ও স্বচ্ছ প্ল্যাটফর্ম।
                    </p>
                </div>
            </section>

            <section>
                <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
                    <div className="space-y-8 text-base leading-7 text-zinc-700">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                আমরা কি?
                            </h2>

                            <p className="mt-4">
                                OpenWitness বাংলাদেশের জনস্বার্থ
                                সংশ্লিষ্ট ঘটনা রিপোর্ট ও নথিভুক্ত
                                করার জন্য একটি anonymous reporting
                                platform। আমাদের লক্ষ্য হলো
                                দুর্নীতি, প্রতারণা, সহিংসতা,
                                সাইবার অপরাধসহ বিভিন্ন জনস্বার্থ
                                সংশ্লিষ্ট ঘটনার একটি স্বচ্ছ
                                নথি তৈরি করা।
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                আমাদের লক্ষ্য
                            </h2>

                            <ul className="mt-4 list-disc pl-6 space-y-2">
                                <li>
                                    নাগরিকদের পরিচয় গোপন রেখে
                                    জনস্বার্থ সংশ্লিষ্ট ঘটনা
                                    রিপোর্ট করার সুযোগ দেওয়া।
                                </li>

                                <li>
                                    প্রতিটি রিপোর্ট যাচাই ও
                                    moderation-এর মাধ্যমে
                                    তথ্যের নির্ভরযোগ্যতা নিশ্চিত
                                    করা।
                                </li>

                                <li>
                                    প্রকাশিত ঘটনার মাধ্যমে
                                    জনস্বার্থ সম্পর্কে সচেতনতা
                                    বৃদ্ধি করা।
                                </li>

                                <li>
                                    বাংলাদেশের ৮টি বিভাগ ও ৬৪টি
                                    জেলাজুড়ে ঘটনা খুঁজে পেতে
                                    সাহায্য করা।
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                আমরা কী নই
                            </h2>

                            <ul className="mt-4 list-disc pl-6 space-y-2">
                                <li>
                                    আমরা সরকারি বা আইনি
                                    প্রতিষ্ঠান নই।
                                </li>

                                <li>
                                    আমরা ঘটনার তদন্ত করি না।
                                </li>

                                <li>
                                    আমরা প্রকাশিত রিপোর্টের
                                    জন্য দায়ী নই।
                                </li>

                                <li>
                                    প্রতিটি রিপোর্ট একটি
                                    প্রতিবেদন মাত্র, প্রমাণ নয়।
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                কেন OpenWitness?
                            </h2>

                            <p className="mt-4">
                                বাংলাদেশে জনস্বার্থ সংশ্লিষ্ট
                                অনেক ঘটনা ঘটে, কিন্তু
                                পরিচয় প্রকাশের ভয়ে অনেকে
                                রিপোর্ট করতে পারেন না।
                                OpenWitness এই সমস্যার
                                সমাধান করে — আপনার পরিচয়
                                সম্পূর্ণ গোপন রেখেই ঘটনা
                                রিপোর্ট করুন।
                            </p>

                            <p className="mt-4">
                                প্রতিটি রিপোর্ট moderation দল
                                দ্বারা পর্যালোচিত হয় এবং
                                অনুমোদনের পর প্রকাশিত হয়।
                                এতে তথ্যের নির্ভরযোগ্যতা
                                বৃদ্ধি পায়।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
