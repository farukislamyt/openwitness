import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { display_name } = body;

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
                { error: "শুধুমাত্র অ্যাডমিন ব্যবহারকারী তৈরি করতে পারেন।" },
                { status: 403 },
            );
        }

        return NextResponse.json(
            {
                error: "নতুন ব্যবহারকারী তৈরি করতে Supabase Dashboard ব্যবহার করুন। এরপর এই পৃষ্ঠায় এসে ভূমিকা পরিবর্তন করুন।",
            },
            { status: 400 },
        );
    } catch {
        return NextResponse.json(
            { error: "একটি ত্রুটি ঘটেছে।" },
            { status: 500 },
        );
    }
}
