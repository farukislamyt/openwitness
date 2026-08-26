"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        function toggleVisibility() {
            setIsVisible(window.scrollY > 500);
        }

        window.addEventListener("scroll", toggleVisibility, {
            passive: true,
        });

        return () =>
            window.removeEventListener("scroll", toggleVisibility);
    }, []);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="উপরে যান"
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg transition hover:bg-zinc-800 hover:shadow-xl"
        >
            <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
            </svg>
        </button>
    );
}
