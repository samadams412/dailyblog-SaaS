"use client"
import React from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { useUser } from "@/lib/store/user";
import Profile from "./Profile";
import Navmenu from "./Navmenu";

export default function Navbar() {
	const user = useUser((state) => state.user);

	return (
		<nav className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
			<div className="group">
				<Link href="/" className="text-2xl font-bold">
					Sams Blog
				</Link>
				<div className="h-1 w-0 group-hover:w-full transition-all bg-blue-500"></div>
			</div>
			<Navmenu />
			{/* optional chaining on user?.id if user is null or undefined the entire expression evaluates to undefined */}
			{user?.id ? <Profile /> : <LoginForm />}
		</nav>
	);
}
