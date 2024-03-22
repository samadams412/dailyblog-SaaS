"use client";
import { createBrowserClient } from "@supabase/ssr";
import React, { useEffect } from "react";
import { useUser } from "../lib/store/user";
import { Database } from "@/lib/types/supabase";
export default function SessionProvider() {
	const setUser = useUser((state) => state.setUser);

	const supabase = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	useEffect(() => {
		readUserSession();
		// eslint-disable-next-line
	}, []);
	
	const readUserSession = async () => {
		const { data } = await supabase.auth.getSession();
		const { data: userInfo } = await supabase
			.from("users")
			.select("*")
			.eq("id", data.session?.user.id!)
			.single();
		setUser(userInfo);
	};

	return <></>;
}
