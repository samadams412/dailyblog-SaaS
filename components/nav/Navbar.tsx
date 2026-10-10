"use client"
import React from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { useUser } from "@/lib/store/user";
import Profile from "./Profile";
import Navmenu from "./Navmenu";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
	const user = useUser((state) => state.user);
	const isUserLoading = useUser((state) => state.isLoading);

	return (
		<nav className="flex items-center justify-between px-4 py-2 bg-background text-foreground border-b border-border">
			<div className="group">
				<Link href="/" className="text-2xl font-display font-bold">
					Sams Blog
				</Link>
				<div className="h-1 w-0 group-hover:w-full transition-all bg-primary"></div>
			</div>
			<Navmenu />
			<div className="flex items-center gap-2">
				<ThemeToggle />
				{/* optional chaining on user?.id if user is null or undefined the entire expression evaluates to undefined */}
				{isUserLoading ? null : user?.id ? <Profile /> : <LoginForm />}
			</div>
		</nav>
	);
}
