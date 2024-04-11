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
		<div className="lg:text-xl flex items-center justify-center text-3xl mr-4 rounded-md  ring-blue-500 hover:ring-1 transition-all cursor-pointer">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger className="cursor-pointer">Categories</MenubarTrigger>

					<MenubarContent className="lg:text-xl flex flex-col justify-center text-3xl gap-2 md:flex-row">
						<MenubarItem className="">
							<Link href="gaming" className="">
								Gaming
							</Link>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="2em"
								height="2em"
								viewBox="0 0 512 512"
                                className=""
							>
								<path
									fill="#f5f5f5"
									d="M155.084 125.945q-.69-.001-1.397.034c-5.646.285-12.097 2.464-20.707 8.204c-21.824 14.55-51.912 60.395-67.834 110.005c-15.92 49.61-18.046 102.25 5.936 132.966c4.142 5.306 13.387 8.93 23.756 8.846c10.216-.084 20.682-3.838 26.482-9.44c1.022-1.47 9.296-13.336 21.39-27.404c12.863-14.96 28.716-31.686 45.835-38.777c41.863-17.34 93.024-17.34 134.887 0c17.118 7.092 32.97 23.818 45.834 38.778c12.095 14.068 20.37 25.933 21.39 27.404c5.8 5.602 16.267 9.356 26.483 9.44c10.368.085 19.612-3.54 23.755-8.846c23.973-30.704 21.885-83.575 5.978-133.287s-46.054-95.526-67.783-109.624c-11.498-7.46-19.198-8.73-26.285-7.64c-7.088 1.093-14.347 5.197-22.866 11.07c-17.038 11.746-38.898 30.02-73.952 30.02c-35.212 0-57.115-18.514-74.13-30.356c-8.505-5.92-15.73-10.025-22.743-11.078a27.6 27.6 0 0 0-4.03-.317zm212.904 48.75a16 16 0 0 1 16 16a16 16 0 0 1-16 16a16 16 0 0 1-16-16a16 16 0 0 1 16-16M135 183h18v32h32v18h-32v32h-18v-32h-32v-18h32zm200.988 23.695a16 16 0 0 1 16 16a16 16 0 0 1-16 16a16 16 0 0 1-16-16a16 16 0 0 1 16-16m64 0a16 16 0 0 1 16 16a16 16 0 0 1-16 16a16 16 0 0 1-16-16a16 16 0 0 1 16-16m-32 32a16 16 0 0 1 16 16a16 16 0 0 1-16 16a16 16 0 0 1-16-16a16 16 0 0 1 16-16m-160 7h32v18h-32zm64 0h27.897v18h-27.897z"
								></path>
							</svg>
						</MenubarItem>

						<MenubarSeparator />
						<MenubarItem className="">
							<Link href="coding">Coding</Link>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.5em"
								height="1.5em"
								viewBox="0 0 32 32"
							>
								<path
									fill="#0065a9"
									d="m29.01 5.03l-5.766-2.776a1.742 1.742 0 0 0-1.989.338L2.38 19.8a1.166 1.166 0 0 0-.08 1.647c.025.027.05.053.077.077l1.541 1.4a1.165 1.165 0 0 0 1.489.066L28.142 5.75A1.158 1.158 0 0 1 30 6.672v-.067a1.748 1.748 0 0 0-.99-1.575"
								></path>
								<path
									fill="#007acc"
									d="m29.01 26.97l-5.766 2.777a1.745 1.745 0 0 1-1.989-.338L2.38 12.2a1.166 1.166 0 0 1-.08-1.647c.025-.027.05-.053.077-.077l1.541-1.4A1.165 1.165 0 0 1 5.41 9.01l22.732 17.24A1.158 1.158 0 0 0 30 25.328v.072a1.749 1.749 0 0 1-.99 1.57"
								></path>
								<path
									fill="#1f9cf0"
									d="M23.244 29.747a1.745 1.745 0 0 1-1.989-.338A1.025 1.025 0 0 0 23 28.684V3.316a1.024 1.024 0 0 0-1.749-.724a1.744 1.744 0 0 1 1.989-.339l5.765 2.772A1.748 1.748 0 0 1 30 6.6v18.8a1.748 1.748 0 0 1-.991 1.576Z"
								></path>
							</svg>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</div>
	);
}
