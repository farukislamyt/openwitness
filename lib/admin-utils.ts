export function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: "নতুন",
        under_review: "পর্যালোচনাধীন",
        needs_revision: "সংশোধন প্রয়োজন",
        approved: "অনুমোদিত",
        rejected: "প্রত্যাখ্যাত",
        archived: "সংরক্ষিত",
    };
    return labels[status] ?? status;
}

export function statusStyles(status: string): string {
    const base =
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

    switch (status) {
        case "pending":
            return `${base} bg-amber-100 text-amber-800`;
        case "under_review":
            return `${base} bg-blue-100 text-blue-800`;
        case "needs_revision":
            return `${base} bg-orange-100 text-orange-800`;
        case "approved":
            return `${base} bg-green-100 text-green-800`;
        case "rejected":
            return `${base} bg-red-100 text-red-800`;
        case "archived":
            return `${base} bg-zinc-100 text-zinc-800`;
        default:
            return `${base} bg-zinc-100 text-zinc-800`;
    }
}

export function verificationLabel(status: string): string {
    switch (status) {
        case "reported":
            return "প্রতিবেদিত";
        case "verified":
            return "যাচাইকৃত";
        case "disputed":
            return "বিতর্কিত";
        default:
            return status;
    }
}

export function actionLabel(action: string): string {
    const labels: Record<string, string> = {
        started_review: "পর্যালোচনা শুরু",
        approved: "অনুমোদিত",
        rejected: "প্রত্যাখ্যাত",
        needs_revision: "সংশোধন প্রয়োজন",
        archived: "সংরক্ষিত",
        edited: "সম্পাদিত",
        redacted: "সরানো হয়েছে",
        restored: "পুনরুদ্ধার",
    };
    return labels[action] ?? action;
}

export function actionStyles(action: string): string {
    const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold";

    switch (action) {
        case "approved":
            return `${base} bg-green-100 text-green-800`;
        case "rejected":
            return `${base} bg-red-100 text-red-800`;
        case "started_review":
            return `${base} bg-blue-100 text-blue-800`;
        case "needs_revision":
            return `${base} bg-orange-100 text-orange-800`;
        case "edited":
            return `${base} bg-purple-100 text-purple-800`;
        case "archived":
            return `${base} bg-zinc-100 text-zinc-700`;
        default:
            return `${base} bg-zinc-100 text-zinc-800`;
    }
}

export function roleLabel(role: string): string {
    switch (role) {
        case "admin":
            return "অ্যাডমিন";
        case "moderator":
            return "মডারেটর";
        default:
            return role;
    }
}

export function reasonLabel(reason: string): string {
    switch (reason) {
        case "personal_information":
            return "ব্যক্তিগত তথ্য";
        case "false_or_misleading":
            return "মিথ্যা বা বিভ্রান্তিকর";
        case "harassment_or_hate":
            return "হয়রানি বা ঘৃণা";
        case "threat_or_violence":
            return "হুমুকি বা সহিংসতা";
        case "duplicate":
            return "ডুপ্লিকেট";
        case "other":
            return "অন্যান্য";
        default:
            return reason;
    }
}

export function buildAdminUrl(
    basePath: string,
    currentParams: Record<string, string>,
    overrides: Record<string, string>,
): string {
    const sp = new URLSearchParams();

    const merged = { ...currentParams, ...overrides };

    for (const [key, value] of Object.entries(merged)) {
        if (value && value !== "") {
            sp.set(key, value);
        }
    }

    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
}

export type StatusOption = {
    value: string;
    label: string;
};

export const STATUS_OPTIONS: StatusOption[] = [
    { value: "", label: "সব" },
    { value: "pending", label: "নতুন" },
    { value: "under_review", label: "পর্যালোচনাধীন" },
    { value: "needs_revision", label: "সংশোধন প্রয়োজন" },
    { value: "approved", label: "অনুমোদিত" },
    { value: "rejected", label: "প্রত্যাখ্যাত" },
];

export const REPORT_STATUS_OPTIONS: StatusOption[] = [
    { value: "", label: "সব" },
    { value: "pending", label: "অপেক্ষমাণ" },
    { value: "reviewed", label: "পর্যালোচিত" },
    { value: "dismissed", label: "বাতিলকৃত" },
    { value: "action_taken", label: "কার্যকর" },
];
