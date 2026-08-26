"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ModerationResult = {
    success: boolean;
    error?: string;
};

export async function moderateIncident(
    incidentId: string,
    action: "approved" | "rejected",
    notes?: string,
): Promise<ModerationResult> {
    if (
        action !== "approved" &&
        action !== "rejected"
    ) {
        return {
            success: false,
            error: "অনুমোদিত কর্ম সঠিক নয়।",
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            success: false,
            error: "প্রমাণীকরণ ব্যর্থ। আবার লগইন করুন।",
        };
    }

    const { data: staffUser, error: staffError } = await supabase
        .from("admin_users")
        .select("id, role, is_active")
        .eq("auth_user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

    if (staffError || !staffUser) {
        return {
            success: false,
            error: "প্রশাসনিক অনুমতি নেই।",
        };
    }

    const { data: incident, error: fetchError } = await supabase
        .from("incidents")
        .select("id, status, public_id")
        .eq("id", incidentId)
        .maybeSingle();

    if (fetchError || !incident) {
        console.error(
            "[OpenWitness] Incident fetch failed:",
            JSON.stringify(
                fetchError
                    ? {
                          code: fetchError.code,
                          message: fetchError.message,
                          details: fetchError.details,
                          hint: fetchError.hint,
                      }
                    : "not_found",
                null,
                2,
            ),
        );

        return {
            success: false,
            error: "রিপোর্ট খুঁজে পাওয়া যায়নি।",
        };
    }

    if (
        incident.status !== "pending" &&
        incident.status !== "under_review" &&
        incident.status !== "needs_revision"
    ) {
        return {
            success: false,
            error: `এই রিপোর্টটি বর্তমানে "${incident.status}" অবস্থায় আছে। শুধুমাত্র অপেক্ষমাণ রিপোর্ট পর্যালোচনা করা যাবে।`,
        };
    }

    const updateData: {
        status: "approved" | "rejected";
        published_at?: string;
    } = {
        status: action,
    };

    if (action === "approved") {
        updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
        .from("incidents")
        .update(updateData)
        .eq("id", incidentId);

    if (updateError) {
        console.error(
            "[OpenWitness] Incident update failed:",
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

        return {
            success: false,
            error: `রিপোর্ট আপডেট করা যায়নি: ${updateError.message}`,
        };
    }

    console.info(
        "[OpenWitness] Incident moderated:",
        incident.public_id,
        action,
    );

    if (notes && notes.trim()) {
        const { data: latestAction } = await supabase
            .from("moderation_actions")
            .select("id")
            .eq("incident_id", incidentId)
            .eq("admin_user_id", staffUser.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (latestAction) {
            const { error: notesError } = await supabase
                .from("moderation_actions")
                .update({ notes: notes.trim() })
                .eq("id", latestAction.id);

            if (notesError) {
                console.error(
                    "[OpenWitness] Moderation notes update failed:",
                    JSON.stringify(
                        {
                            code: notesError.code,
                            message: notesError.message,
                            details: notesError.details,
                            hint: notesError.hint,
                        },
                        null,
                        2,
                    ),
                );
            }
        }
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/incidents/${incidentId}`);

    redirect(`/admin/incidents/${incidentId}?success=${action}`);
}
