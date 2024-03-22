import { useUser } from "@/lib/store/user";
import Image from "next/image";
import React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "../ui/button";
import { DashboardIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { createBrowserClient } from "@supabase/ssr";
import ManageBilling from "../stripe/ManageBilling";

export default function Profile() {
	const user = useUser((state) => state.user);
	const setUser = useUser((state) => state.setUser);
    const isAdmin = user?.role === "admin";
    const isSub = user?.subscriptions_status;
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};


	return (
		<div>
			<Popover>
				<PopoverTrigger>
					<Image
						src={user?.image_url || ""}
						alt={user?.display_name || ""}
						width={50}
						height={50}
						className="rounded-full ring-2 ring-blue-500 hover:ring-4 transition-all cursor-pointer"
					></Image>
				</PopoverTrigger>
				<PopoverContent className="p-2 space-y-3 divide-y">
					<div className="px-4 text-sm">
						<p>{user?.display_name}</p>
						<p className="text-gray-500">{user?.email}</p>
					</div>
					{isAdmin && (
						<Link href="/dashboard" className="block">
							<Button
								variant="ghost"
								className="w-full flex items-center justify-between"
							>
								Dashboard
								<DashboardIcon />
							</Button>
						</Link>
					)}
					{isSub && <ManageBilling />}
					<Button
						variant="ghost"
						className="w-full flex items-center justify-between"
						onClick={handleLogout}
					>
						Logout
						<LockOpen1Icon />
					</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
}
