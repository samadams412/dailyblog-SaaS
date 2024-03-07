import React from "react";
import { BsCopy } from "react-icons/bs";

export default function CopyButton({ id }: { id: string }) {
	const handleCopy = async () => {
		const text = document.getElementById(id)?.textContent;
		try {
			await navigator.clipboard.writeText(text!);
		} catch {}
	};

	return (
		<div
			onClick={handleCopy}
			className="p-2 hover:scale-105 cursor-pointer hover:bg-zinc-700 rounded-md"
		>
			<BsCopy />
		</div>
	);
}
