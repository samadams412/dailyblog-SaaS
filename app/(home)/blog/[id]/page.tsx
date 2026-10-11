import { IBlog } from "@/lib/types";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlogContent from "./components/BlogContent";
import ShareButtons from "@/components/ShareButtons";
import { notFound } from "next/navigation";
import { readBlog } from "@/lib/actions/blog"; // import database reader
import { createClient } from "@supabase/supabase-js"; // Import standard client
import { readPostsBySeries, readSeriesById } from "@/lib/actions/series";

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

	let seriesNav: {
		title: string;
		slug: string;
		position: number;
		total: number;
		prev: { id: string; title: string } | null;
		next: { id: string; title: string } | null;
	} | null = null;

	if (blog.series_id) {
		const [{ data: series }, posts] = await Promise.all([
			readSeriesById(blog.series_id),
			readPostsBySeries(blog.series_id),
		]);
		const index = posts.findIndex((p) => p.id === blog.id);
		if (series && index !== -1) {
			seriesNav = {
				title: series.title,
				slug: series.slug,
				position: index + 1,
				total: posts.length,
				prev: index > 0 ? { id: posts[index - 1].id, title: posts[index - 1].title } : null,
				next:
					index < posts.length - 1
						? { id: posts[index + 1].id, title: posts[index + 1].title }
						: null,
			};
		}
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
				{seriesNav && (
					<div className="border border-border rounded-md p-4 space-y-2">
						<Link
							href={"/series/" + seriesNav.slug}
							className="text-sm font-medium hover:underline"
						>
							Part {seriesNav.position} of {seriesNav.total}: {seriesNav.title}
						</Link>
						<div className="flex items-center justify-between gap-4 text-sm">
							{seriesNav.prev ? (
								<Link
									href={"/blog/" + seriesNav.prev.id}
									className="text-muted-foreground hover:underline truncate"
								>
									← {seriesNav.prev.title}
								</Link>
							) : (
								<span />
							)}
							{seriesNav.next && (
								<Link
									href={"/blog/" + seriesNav.next.id}
									className="text-muted-foreground hover:underline truncate text-right"
								>
									{seriesNav.next.title} →
								</Link>
							)}
						</div>
					</div>
				)}
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
