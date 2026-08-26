import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "রিপোর্ট করুন",
    description:
        "OpenWitness-এ জনস্বার্থের ঘটনা রিপোর্ট করুন। পরিচয় প্রকাশ না করেই নিরাপদে রিপোর্ট জমা দিন।",
    openGraph: {
        title: "রিপোর্ট করুন | OpenWitness",
        description:
            "OpenWitness-এ জনস্বার্থের ঘটনা রিপোর্ট করুন। পরিচয় প্রকাশ না করেই নিরাপদে রিপোর্ট জমা দিন।",
        url: "https://openwitness.vercel.app/report",
    },
    alternates: {
        canonical: "/report",
    },
};

export default function ReportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
