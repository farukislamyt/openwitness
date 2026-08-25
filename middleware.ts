import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const ADMIN_ROUTES = ["/admin"];

function isAdminRoute(pathname: string): boolean {
    return ADMIN_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/"),
    );
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!isAdminRoute(pathname)) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createClient({
        cookies: () => ({
            getAll() {
                return request.cookies.getAll();
            },
            set(name: string, value: string, options?: Record<string, unknown>) {
                request.cookies.set({ name, value, ...options });
                supabaseResponse = NextResponse.next({ request });
                supabaseResponse.cookies.set(name, value, options);
            },
        }),
    });

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("id, role, is_active")
        .eq("auth_user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

    if (adminError || !adminUser) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "not_admin");
        return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/admin/:path*"],
};
