import React from "react";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
			<p className="text-lg">The blog you are looking for does not exist.</p>
		</div>
	);
}
