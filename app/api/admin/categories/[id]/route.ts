import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
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
                { error: "শুধুমাত্র অ্যাডমিন শ্রেণি সম্পাদনা করতে পারেন।" },
                { status: 403 },
            );
        }

        const { data: existingCategory } = await supabase
            .from("categories")
            .select("id")
            .eq("id", id)
            .maybeSingle();

        if (!existingCategory) {
            return NextResponse.json(
                { error: "শ্রেণি খুঁজে পাওয়া যায়নি।" },
                { status: 404 },
            );
        }

        const { data: existingSlug } = await supabase
            .from("categories")
            .select("slug")
            .eq("slug", slug)
            .neq("id", id)
            .maybeSingle();

        if (existingSlug) {
            return NextResponse.json(
                { error: "এই স্লাগটি ইতিমধ্যে ব্যবহৃত হয়েছে।" },
                { status: 409 },
            );
        }

        const { error: updateError } = await supabase
            .from("categories")
            .update({
                name,
                slug,
                description: description || null,
                is_active: is_active ?? true,
                sort_order: sort_order ?? 0,
            })
            .eq("id", id);

        if (updateError) {
            console.error(
                "[OpenWitness] Category update failed:",
                JSON.stringify(
                    {
                        code: updateError.code,
                        message: updateError.message,
                        details: updateError.details,
                        hint: updateError.hint,
                    },
                    null,
                    2,
                ),
            );
            return NextResponse.json(
                { error: "শ্রেণি আপডেট করা যায়নি।" },
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
