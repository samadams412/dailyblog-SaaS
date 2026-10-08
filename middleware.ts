//This middleware will run on every page
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
        headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get(name: string) {
            return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
                name,
                value,
                ...options,
            });
            response = NextResponse.next({
                request: {
                headers: request.headers,
                },
            });
            },
            remove(name: string, options: CookieOptions) {
            request.cookies.set({
                name,
                value: "",
                ...options,
            });
            response = NextResponse.next({
                request: {
                headers: request.headers,
                },
            });
            },
        },
        }
    );

    // getUser() validates the token with Supabase Auth; getSession() only reads
    // the cookie and must not be trusted for authorization on the server.
    const {data: {user}} = await supabase.auth.getUser();

    if(!user || user.user_metadata.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
    }
        
        
    return response;
}

export const config = {
    matcher:["/dashboard/:path*"]
}
