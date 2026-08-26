import type { NextConfig } from "next";

const securityHeaders = [
    {
        key: "X-DNS-Prefetch-Control",
        value: "on",
    },
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
    },
    {
        key: "X-XSS-Protection",
        value: "1; mode=block",
    },
    {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
    },
];

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
            {
                source: "/api/(.*)",
                headers: [
                    ...securityHeaders,
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate",
                    },
                ],
            },
            {
                source: "/sitemap.xml",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=3600, s-maxage=3600",
                    },
                ],
            },
            {
                source: "/robots.txt",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400, s-maxage=86400",
                    },
                ],
            },
        ];
    },

    async redirects() {
        return [
            {
                source: "/incident/:path*",
                destination: "/incidents/:path*",
                permanent: true,
            },
            {
                source: "/report/:path*",
                destination: "/report",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
