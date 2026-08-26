import Link from "next/link";
import JsonLd from "./JsonLd";

type BreadcrumbItem = {
    label: string;
    href?: string;
};

export default function Breadcrumbs({
    items,
}: {
    items: BreadcrumbItem[];
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href
                ? { item: `https://openwitness.vercel.app${item.href}` }
                : {}),
        })),
    };

    return (
        <nav aria-label="ব্রেডক্রাম্ব" className="mb-6">
            <JsonLd data={jsonLd} />

            <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                        {index > 0 ? (
                            <span className="text-zinc-300">/</span>
                        ) : null}

                        {item.href ? (
                            <Link
                                href={item.href}
                                className="transition hover:text-zinc-950"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-zinc-950 font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
