"use client";
import { createBrowserClient } from "@supabase/ssr";
import React, { useEffect } from "react";
import { useUser } from "../lib/store/user";
import { Database } from "@/lib/types/supabase";
export default function sessionProvider() {
	const setUser = useUser((state) => state.setUser);

	const supabase = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	//get the session
	const readUserSession = async () => {
		const { data } = await supabase.auth.getSession();
		const { data: userInfo } = await supabase
			.from("users")
			.select("*")
			.eq("id", data.session?.user.id!)
			.single();
		setUser(userInfo);
	};
	useEffect(() => {
		readUserSession();
		// eslint-disable-next-line
	}, []);

	return <></>;
}
