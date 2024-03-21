import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function BlogLoading() {
	return (
		<div className="flex items-center justify-center p-10">
			
			<FaSpinner className="animate-spin h-10 w-10 text-gray-300" />
		</div>
	);
}
