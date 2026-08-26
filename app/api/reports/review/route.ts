import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reportId, action } = body;

        if (!reportId || !action) {
            return NextResponse.json(
                { error: "reportId এবং action প্রয়োজন।" },
                { status: 400 },
            );
        }

        if (
            action !== "dismissed" &&
            action !== "action_taken"
        ) {
            return NextResponse.json(
                { error: "অবৈধ action।" },
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
            .select("id, is_active")
            .eq("auth_user_id", user.id)
            .eq("is_active", true)
            .maybeSingle();

        if (adminError || !adminUser) {
            return NextResponse.json(
                { error: "অ্যাডমিন অনুমোদন প্রয়োজন।" },
                { status: 403 },
            );
        }

        const { data: report, error: reportError } = await supabase
            .from("incident_reports")
            .select("id, status")
            .eq("id", reportId)
            .maybeSingle();

        if (reportError) {
            console.error(
                "[OpenWitness] Report fetch failed:",
                JSON.stringify(
                    {
                        code: reportError.code,
                        message: reportError.message,
                        details: reportError.details,
                        hint: reportError.hint,
                    },
                    null,
                    2,
                ),
            );
            return NextResponse.json(
                { error: "রিপোর্ট খুঁজে পাওয়া যায়নি।" },
                { status: 500 },
            );
        }

        if (!report) {
            return NextResponse.json(
                { error: "রিপোর্ট খুঁজে পাওয়া যায়নি।" },
                { status: 404 },
            );
        }

        if (report.status !== "pending") {
            return NextResponse.json(
                { error: "এই রিপোর্টটি ইতিমধ্যে পর্যালোচিত হয়েছে।" },
                { status: 409 },
            );
        }

        const { error: updateError } = await supabase
            .from("incident_reports")
            .update({
                status: action,
                reviewed_by: adminUser.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", reportId)
            .eq("status", "pending");

        if (updateError) {
            console.error(
                "[OpenWitness] Report update failed:",
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
                { error: "রিপোর্ট আপডেট করা যায়নি।" },
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
