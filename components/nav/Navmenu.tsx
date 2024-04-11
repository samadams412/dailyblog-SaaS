import Link from "next/link";
import React from "react";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";

export default function Navmenu() {
	return (
		<div className="">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Categories</MenubarTrigger>
                    
					<MenubarContent>
						<MenubarItem className="lg:text-xl">
							<Link href="gaming">Gaming</Link>
						</MenubarItem>

						<MenubarSeparator />
						<MenubarItem className="lg:text-xl">
							<Link href="coding">Coding</Link>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</div>
	);
}
