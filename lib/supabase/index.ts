"use server";

import { createServerClient } from "@supabase/ssr";
import { Database } from "../types/supabase";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function createSupabaseServerClient() {
	const cookieStore = cookies();
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// Called from a Server Component, where cookies are read-only.
						// Safe to ignore: the middleware refreshes the session.
					}
				},
			},
		}
	);
}

export async function createSupabaseAdmin<Database>() {
	return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SERVICE_ROLE!, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
