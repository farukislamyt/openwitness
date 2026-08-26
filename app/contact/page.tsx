import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
    title: "যোগাযোগ",
    description:
        "OpenWitness-এর সাথে যোগাযোগ করুন — আইনি ও প্রশাসনিক জিজ্ঞাসা।",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <SiteHeader />

            <section className="border-b border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        যোগাযোগ
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg text-zinc-600">
                        প্রশ্ন, মতামত বা আইনি
                        জিজ্ঞাসার জন্য যোগাযোগ
                        করুন।
                    </p>
                </div>
            </section>

            <section>
                <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                সাধারণ যোগাযোগ
                            </h2>

                            <div className="mt-6 space-y-4 text-zinc-700">
                                <p>
                                    OpenWitness সম্পর্কে
                                    প্রশ্ন বা
                                    মতামত থাকলে
                                    আমাদের
                                    সাথে
                                    যোগাযোগ
                                    করুন।
                                </p>

                                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                                    <p className="text-sm font-medium text-zinc-500">
                                        Email
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        contact@openwitness.org
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                আইনি জিজ্ঞাসা
                            </h2>

                            <div className="mt-6 space-y-4 text-zinc-700">
                                <p>
                                    আইনি প্রশ্ন বা
                                    অনুরোধের
                                    জন্য:
                                </p>

                                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                                    <p className="text-sm font-medium text-zinc-500">
                                        Email
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        legal@openwitness.org
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-bold tracking-tight">
                            তথ্য অনুরোধ
                        </h2>

                        <div className="mt-6 text-zinc-700">
                            <p>
                                আপনি যদি
                                আপনার
                                সম্পর্কে
                                কোনো
                                তথ্য
                                জানতে
                                চান
                                বা
                                তথ্য
                                মুছে
                                ফেলতে
                                চান,
                                তাহলে
                                আমাদের
                                সাথে
                                যোগাযোগ
                                করুন।
                            </p>

                            <p className="mt-4">
                                <strong>গুরুত্বপূর্ণ:</strong>{" "}
                                যেহেতু
                                OpenWitness
                                anonymous
                                প্ল্যাটফর্ম,
                                তাই
                                রিপোর্টকারীর
                                পরিচয়
                                সম্পর্কে
                                কোনো
                                তথ্য
                                সংরক্ষিত
                                হয়
                                না।
                                তাই
                                নির্দিষ্ট
                                রিপোর্ট
                                সম্পর্কে
                                তথ্য
                                প্রদান
                                করা
                                আমাদের
                                পক্ষে
                                সম্ভব
                                নাও
                                হতে
                                পারে।
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
                        <h2 className="text-lg font-bold">
                            সতর্কতা
                        </h2>

                        <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                            <p>
                                আইনি
                                জিজ্ঞাসার
                                জন্য
                                শুধুমাত্র
                                legal@openwitness.org
                                ব্যবহার
                                করুন।
                            </p>

                            <p>
                                সাধারণ
                                প্রশ্নের
                                জন্য
                                contact@openwitness.org
                                ব্যবহার
                                করুন।
                            </p>

                            <p>
                                আমরা
                                সাধারণত
                                ৪৮
                                ঘণ্টার
                                মধ্যে
                                উত্তর
                                দেওয়ার
                                চেষ্টা
                                করি।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
