import Link from "next/link";

export default function SiteHeader() {
    return (
        <header className="border-b border-zinc-200">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tight"
                    aria-label="OpenWitness হোম"
                >
                    OpenWitness
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
                    <Link
                        href="/incidents"
                        className="transition-colors hover:text-zinc-500"
                    >
                        প্রকাশিত ঘটনা
                    </Link>

                    <Link
                        href="/how-it-works"
                        className="transition-colors hover:text-zinc-500"
                    >
                        কীভাবে কাজ করে
                    </Link>

                    <Link
                        href="/about"
                        className="transition-colors hover:text-zinc-500"
                    >
                        আমাদের সম্পর্কে
                    </Link>

                    <Link
                        href="/report"
                        className="rounded-full bg-zinc-950 px-5 py-2.5 text-white transition-colors hover:bg-zinc-800"
                    >
                        রিপোর্ট করুন
                    </Link>
                </nav>

                <Link
                    href="/report"
                    className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white md:hidden"
                >
                    রিপোর্ট করুন
                </Link>
            </div>
        </header>
    );
}
