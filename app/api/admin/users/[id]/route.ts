import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { display_name, role, is_active } = body;

        if (!display_name) {
            return NextResponse.json(
                { error: "প্রদর্শন নাম প্রয়োজন।" },
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
                { error: "শুধুমাত্র অ্যাডমিন ব্যবহারকারী সম্পাদনা করতে পারেন।" },
                { status: 403 },
            );
        }

        const { data: existingUser } = await supabase
            .from("admin_users")
            .select("id")
            .eq("id", id)
            .maybeSingle();

        if (!existingUser) {
            return NextResponse.json(
                { error: "ব্যবহারকারী খুঁজে পাওয়া যায়নি।" },
                { status: 404 },
            );
        }

        if (id === adminUser.id && role !== "admin") {
            return NextResponse.json(
                { error: "আপনি নিজের ভূমিকা পরিবর্তন করতে পারবেন না।" },
                { status: 400 },
            );
        }

        if (id === adminUser.id && !is_active) {
            return NextResponse.json(
                { error: "আপনি নিজেকে নিষ্ক্রিয় করতে পারবেন না।" },
                { status: 400 },
            );
        }

        const { error: updateError } = await supabase
            .from("admin_users")
            .update({
                display_name,
                role: role ?? "moderator",
                is_active: is_active ?? true,
            })
            .eq("id", id);

        if (updateError) {
            console.error(
                "[OpenWitness] Admin user update failed:",
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
                { error: "ব্যবহারকারী আপডেট করা যায়নি।" },
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
