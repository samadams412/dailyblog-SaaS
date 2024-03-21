import { IBlog } from "@/lib/types";
import React from "react";
import Image from "next/image";
export default async function page({ params }: { params: { id: string } }) {
	const { data: blog } = (await fetch(
		process.env.SITE_URL + "/api/blog?id=" + params.id
	).then((res) => res.json())) as { data: IBlog };

	return (
		<div className="max-w-5xl mx-auto min-h-screen pt-10 space-y-10">
			<div className="sm:px-10 space-y-5">
				<h1 className="text-3xl font-bold">{blog?.title}</h1>
				<p className="text-sm text-gray-400">
					{new Date(blog?.created_at || "").toDateString()}
				</p>
			</div>
			<div className="w-full h-96 relative">
				<Image
					priority
					src={blog?.image_url || "/"}
					alt="cover"
					fill
					className="object-cover object-center rounded-md border"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px): 50vw, 33vw"
				/>
			</div>
		</div>
	);
}
