import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient(request: {
    cookies: () => {
        getAll: () => { name: string; value: string }[];
        set: (
            name: string,
            value: string,
            options?: Record<string, unknown>,
        ) => void;
    };
}) {
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies().getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies().set(name, value, options),
                    );
                },
            },
        },
    );
}
