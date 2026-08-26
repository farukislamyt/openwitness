import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type PolicyLayoutProps = {
    title: string;
    subtitle: string;
    lastUpdated: string;
    children: React.ReactNode;
};

export default function PolicyLayout({
    title,
    subtitle,
    lastUpdated,
    children,
}: PolicyLayoutProps) {
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
                        {title}
                    </h1>

                    <p className="mt-4 text-lg text-zinc-600">
                        {subtitle}
                    </p>

                    <p className="mt-3 text-sm text-zinc-400">
                        শেষ হালনাগাদ: {lastUpdated}
                    </p>
                </div>
            </section>

            <section>
                <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
                    <div className="prose prose-zinc max-w-none text-base leading-7 text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:mt-2 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-zinc-900">
                        {children}
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
