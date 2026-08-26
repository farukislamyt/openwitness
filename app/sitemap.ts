import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://openwitness.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/report`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/incidents`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/reporting-guidelines`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/community-guidelines`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/content-policy`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.4,
        },
    ];

    let incidentEntries: MetadataRoute.Sitemap = [];

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        );

        const { data: incidents } = await supabase
            .from("incidents")
            .select("id, updated_at, published_at")
            .eq("status", "approved")
            .order("published_at", { ascending: false })
            .limit(500);

        if (incidents && incidents.length > 0) {
            incidentEntries = incidents.map((incident) => ({
                url: `${BASE_URL}/incidents/${incident.id}`,
                lastModified: new Date(
                    incident.updated_at || incident.published_at || new Date(),
                ),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            }));
        }
    } catch (error) {
        console.error(
            "[OpenWitness] Sitemap: Failed to fetch incidents:",
            error,
        );
    }

    return [...staticPages, ...incidentEntries];
}
