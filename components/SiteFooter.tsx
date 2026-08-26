import Link from "next/link";

export default function SiteFooter() {
    return (
        <footer className="border-t border-zinc-200">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Link
                            href="/"
                            className="text-lg font-bold tracking-tight"
                        >
                            OpenWitness
                        </Link>

                        <p className="mt-3 text-sm leading-6 text-zinc-500">
                            বাংলাদেশের জনস্বার্থে একটি anonymous
                            reporting platform।
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900">
                            প্ল্যাটফর্ম
                        </h3>

                        <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                            <li>
                                <Link
                                    href="/report"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    রিপোর্ট করুন
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/incidents"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    প্রকাশিত ঘটনা
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/how-it-works"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    কীভাবে কাজ করে
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/about"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    আমাদের সম্পর্কে
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900">
                            নীতিমালা
                        </h3>

                        <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/terms"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    Terms of Use
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/reporting-guidelines"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    Reporting Guidelines
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/community-guidelines"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    Community Guidelines
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/content-policy"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    Content &amp; Publication Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900">
                            যোগাযোগ
                        </h3>

                        <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                            <li>
                                <Link
                                    href="/contact"
                                    className="transition-colors hover:text-zinc-700"
                                >
                                    Contact / Legal
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-400">
                    © {new Date().getFullYear()} OpenWitness
                </div>
            </div>
        </footer>
    );
}
