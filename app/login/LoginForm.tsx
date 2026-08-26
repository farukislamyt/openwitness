"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = searchParams.get("redirect") || "/admin";
    const errorParam = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(() => {
        if (errorParam === "not_admin") {
            return "আপনার এই অ্যাকাউন্টে প্রশাসনিক অনুমতি নেই।";
        }
        return "";
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            setError("ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন।");
            setLoading(false);
            return;
        }

        try {
            const { data, error: signInError } =
                await supabase.auth.signInWithPassword({
                    email: trimmedEmail,
                    password,
                });

            if (signInError) {
                console.error(
                    "[OpenWitness] Login failed:",
                    JSON.stringify(
                        {
                            code: signInError.code,
                            message: signInError.message,
                            status: signInError.status,
                        },
                        null,
                        2,
                    ),
                );

                if (signInError.code === "invalid_login_credentials") {
                    setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
                } else if (signInError.code === "email_not_confirmed") {
                    setError("ইমেইল যাচাইকরণ সম্পন্ন হয়নি।");
                } else {
                    setError(
                        `লগইন ব্যর্থ: ${signInError.message}`,
                    );
                }

                return;
            }

            if (!data.user) {
                setError("লগইন ব্যর্থ: ব্যবহারকারী খুঁজে পাওয়া যায়নি।");
                return;
            }

            const { data: adminUser, error: adminError } = await supabase
                .from("admin_users")
                .select("id, role, is_active")
                .eq("auth_user_id", data.user.id)
                .eq("is_active", true)
                .maybeSingle();

            if (adminError) {
                console.error(
                    "[OpenWitness] Admin check failed:",
                    JSON.stringify(
                        {
                            code: adminError.code,
                            message: adminError.message,
                            details: adminError.details,
                            hint: adminError.hint,
                        },
                        null,
                        2,
                    ),
                );

                setError(
                    "প্রশাসনিক অনুমতি যাচাই করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
                );
                return;
            }

            if (!adminUser) {
                await supabase.auth.signOut();

                setError(
                    "আপনার এই অ্যাকাউন্টে প্রশাসনিক অনুমতি নেই।",
                );
                return;
            }

            console.info(
                "[OpenWitness] Admin login successful:",
                adminUser.role,
            );

            router.push(redirectTo);
            router.refresh();
        } catch (unexpectedError) {
            console.error(
                "[OpenWitness] Unexpected login error:",
                unexpectedError,
            );

            setError(
                "লগইন করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে।",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                >
                    {error}
                </div>
            ) : null}

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-semibold"
                >
                    ইমেইল
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                    }}
                    required
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-semibold"
                >
                    পাসওয়ার্ড
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                    }}
                    required
                    autoComplete="current-password"
                    placeholder="আপনার পাসওয়ার্ড"
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-7 py-3.5 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
        </form>
    );
}
