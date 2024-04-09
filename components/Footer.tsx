import React from "react";

export default function Footer() {
	return (
		<footer className="border-t py-10">
			<div className="max-w-7xl py-10 px-5 md:p-0 space-y-5 mx-auto flex justify-between md:items-center flex-col md:flex-row">
				<div className="space-y-10">
					<div className="space-y-2 w-full sm:w-96">
						<h1>Sams Blog LOGO</h1>
						<p>{"My blog to discuss all the content."}</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
