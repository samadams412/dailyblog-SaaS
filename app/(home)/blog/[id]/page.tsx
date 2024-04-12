import { IBlog } from "@/lib/types";
import React from "react";
import Image from "next/image";
import BlogContent from "./components/BlogContent";

//attempt at limiting data on initial load for faster times
export async function generateStaticParams() {
	const { data: blog } = await fetch(
		//testing deployed
		process.env.PROD_URL + "/api/blog?id=" + "*"
	).then((res) => res.json());
	return blog;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
	const { data: blog } = (await fetch(
		process.env.PROD_URL + "/api/blog?id=" + params.id
	).then((res) => res.json())) as { data: IBlog };

	return {
		title: blog?.title,
		authors: {
			name: "Samuel K. Adams",
		},
		openGraph: {
			title: blog?.title,
			url: process.env.SITE_URL + "/blog/" + params.id,
			siteName: "Sam's Blog",
			images: blog?.image_url,
			type: "website",
		},
		keywords: ["Sam's Blog", "Coding", "Gaming", "Technology", "Design", "Finance", "Sports"],
	};
}

export default async function page({ params }: { params: { id: string } }) {
	const { data: blog } = (await fetch(
		process.env.PROD_URL + "/api/blog?id=" + params.id
	).then((res) => res.json())) as { data: IBlog };
	//TODO: Create 404 page
	if (!blog?.id) {
		return <h1 className="text-white">Not found</h1>;
	}

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
			<BlogContent blogId={blog?.id} />
		</div>
	);
}
