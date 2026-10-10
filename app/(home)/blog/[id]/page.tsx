import { IBlog } from "@/lib/types";
import React from "react";
import Image from "next/image";
import BlogContent from "./components/BlogContent";
import ShareButtons from "@/components/ShareButtons";
import { notFound } from "next/navigation";
import { readBlog } from "@/lib/actions/blog"; // import database reader
import { createClient } from "@supabase/supabase-js"; // Import standard client

//attempt at limiting data on initial load for faster times
export async function generateStaticParams() {
	// Create a plain server client that doesn't check for active request cookies
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	// Fetch your public published blog IDs directly
	const { data: blogs, error } = await supabase
		.from("blog")
		.select("id")
		.eq("is_published", true);
	
	if (error || !blogs) {
		console.error("Failed to collect build paths:", error);
		return [];
	}

	// Map them exactly how Next.js expects them
	return blogs.map((blog) => ({
		id: blog.id.toString(),
	}));
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
	if (!blog?.id) {
		notFound();
	}

	return (
		<div className="max-w-5xl mx-auto min-h-screen pt-10 space-y-10">
			<div className="sm:px-10 space-y-5">
				<h1 className="text-3xl font-display font-bold">{blog?.title}</h1>
				<p className="text-sm text-muted-foreground">
					{new Date(blog?.created_at || "").toDateString()}
				</p>
				<ShareButtons
					title={blog?.title || ""}
					url={`${process.env.SITE_URL}/blog/${blog?.id}`}
				/>
			</div>
			<div className="w-full h-96 relative">
				<Image
					priority
					src={blog?.image_url || "/"}
					alt="cover"
					fill
					className="object-cover object-center rounded-md border border-border"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px): 50vw, 33vw"
				/>
			</div>
			<BlogContent blogId={blog?.id} />
		</div>
	);
}
