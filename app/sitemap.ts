import { MetadataRoute } from "next";

const BASE_URL = "https://openwitness.org";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages = [
        "",
        "/report",
        "/incidents",
        "/about",
        "/how-it-works",
        "/privacy",
        "/terms",
        "/reporting-guidelines",
        "/community-guidelines",
        "/content-policy",
        "/contact",
    ];

    const staticEntries: MetadataRoute.Sitemap = staticPages.map(
        (path) => ({
            url: `${BASE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: path === "" ? 1.0 : 0.8,
        }),
    );

    return staticEntries;
}
