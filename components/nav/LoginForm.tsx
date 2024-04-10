"use client";
import { createBrowserClient } from "@supabase/ssr";
import React from "react";
import { Button } from "../ui/button";
import { SiGithub, SiGoogle } from "react-icons/si";
import { usePathname } from "next/navigation";

export default function LoginForm() {
	const pathname = usePathname();

	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const handleLogin = (provider: "google" | "github") => {
		supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: location.origin + "/auth/callback?next=" + pathname,
			},
		});
	};

	return (
		<div className="flex flex-col md:flex-row justify-center items-center gap-2 space-y-1">
			<Button
				variant="outline"
				className="flex items-center gap-2"
				onClick={() => {
					handleLogin("github");
				}}
			>
				<SiGithub />
				Login
			</Button>
            
			<Button
				variant="outline"
				className="flex items-center gap-2"
				onClick={() => {
					handleLogin("google");
				}}
			>
				<SiGoogle />
				Login
			</Button>
		</div>
	);
}
