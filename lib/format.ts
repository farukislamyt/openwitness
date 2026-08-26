const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(n: number): string {
    return String(n)
        .split("")
        .map((d) => BENGALI_DIGITS[Number(d)] ?? d)
        .join("");
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Dhaka",
    });
}

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Dhaka",
    });
}

export function formatShortDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Dhaka",
    });
}
