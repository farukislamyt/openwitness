import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, description, is_active, sort_order } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: "নাম এবং স্লাগ প্রয়োজন।" },
                { status: 400 },
            );
        }

        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "অনুমোদন প্রয়োজন।" },
                { status: 401 },
            );
        }

        const { data: adminUser, error: adminError } = await supabase
            .from("admin_users")
            .select("id, is_active, role")
            .eq("auth_user_id", user.id)
            .eq("is_active", true)
            .maybeSingle();

        if (adminError || !adminUser) {
            return NextResponse.json(
                { error: "অ্যাডমিন অনুমোদন প্রয়োজন।" },
                { status: 403 },
            );
        }

        if (adminUser.role !== "admin") {
            return NextResponse.json(
                { error: "শুধুমাত্র অ্যাডমিন শ্রেণি তৈরি করতে পারেন।" },
                { status: 403 },
            );
        }

        const { data: existingSlug } = await supabase
            .from("categories")
            .select("slug")
            .eq("slug", slug)
            .maybeSingle();

        if (existingSlug) {
            return NextResponse.json(
                { error: "এই স্লাগটি ইতিমধ্যে ব্যবহৃত হয়েছে।" },
                { status: 409 },
            );
        }

        const { error: insertError } = await supabase
            .from("categories")
            .insert({
                name,
                slug,
                description: description || null,
                is_active: is_active ?? true,
                sort_order: sort_order ?? 0,
            });

        if (insertError) {
            console.error(
                "[OpenWitness] Category insert failed:",
                JSON.stringify(
                    {
                        code: insertError.code,
                        message: insertError.message,
                        details: insertError.details,
                        hint: insertError.hint,
                    },
                    null,
                    2,
                ),
            );
            return NextResponse.json(
                { error: "শ্রেণি তৈরি করা যায়নি।" },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "একটি ত্রুটি ঘটেছে।" },
            { status: 500 },
        );
    }
}
