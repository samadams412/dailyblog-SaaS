//This middleware will run on every page
import { createServerClient } from "@supabase/ssr";
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
            getAll() {
            return request.cookies.getAll();
            },
            setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
            );
            response = NextResponse.next({
                request: {
                headers: request.headers,
                },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
            );
            // auth responses must not be cached by a CDN
            Object.entries(headers).forEach(([key, value]) =>
                response.headers.set(key, value)
            );
            },
        },
        }
    );

    // getUser() validates the token with Supabase Auth; getSession() only reads
    // the cookie and must not be trusted for authorization on the server.
    const {data: {user}} = await supabase.auth.getUser();

    // Role comes from public.users, not user_metadata, which users can edit themselves.
    const { data: profile } = user
        ? await supabase.from("users").select("role").eq("id", user.id).single()
        : { data: null };

    if(!profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
    }


    return response;
}

export const config = {
    matcher:["/dashboard/:path*"]
}
