"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link2, Share2 } from "lucide-react";
import { SiX } from "react-icons/si";

export default function ShareButtons({
	title,
	url,
}: {
	title: string;
	url: string;
}) {
	// navigator.share is undefined during SSR; checking it only after mount
	// avoids a hydration mismatch between server and client markup.
	const [canShare, setCanShare] = useState(false);
	useEffect(() => {
		setCanShare(typeof navigator !== "undefined" && !!navigator.share);
	}, []);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(url);
		toast({ title: "Link copied" });
	};

	const handleShare = async () => {
		try {
			await navigator.share({ title, url });
		} catch {
			// user dismissed the native share sheet
		}
	};

	const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
		url
	)}&text=${encodeURIComponent(title)}`;

	return (
		<div className="flex items-center gap-2">
			{canShare && (
				<Button
					variant="outline"
					size="sm"
					onClick={handleShare}
					className="flex items-center gap-2"
				>
					<Share2 className="h-4 w-4" />
					Share
				</Button>
			)}
			<Button
				variant="outline"
				size="sm"
				onClick={handleCopy}
				className="flex items-center gap-2"
			>
				<Link2 className="h-4 w-4" />
				Copy link
			</Button>
			<a href={tweetUrl} target="_blank" rel="noopener noreferrer">
				<Button variant="outline" size="icon" aria-label="Share on X">
					<SiX className="h-4 w-4" />
				</Button>
			</a>
		</div>
	);
}
