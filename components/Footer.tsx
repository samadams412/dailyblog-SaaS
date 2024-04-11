import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

import React from "react";

export default function Footer() {
	return (
		<footer className="border-t py-10">
			<div className="max-w-7xl py-10 px-5 md:p-0 space-y-5 mx-auto flex justify-between md:items-end flex-col md:flex-row">
				<div className="space-y-10">
					<div className="space-y-2 w-full sm:w-96">
						<h1 className="text-3xl font-bold">Sams Blog</h1>
						<p>{"My blog to discuss all the content."}</p>
					</div>
					<div className="flex items-center gap-2">
						<GitHubLogoIcon className="w-5 h-5"/>
						<LinkedInLogoIcon className="w-5 h-5"/>
					</div>
				</div>
				<h1>&copy; 2024 Samuel Adams. All rights reserved.</h1>
			</div>
		</footer>
	);
}