"use client";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import { Database } from "@/lib/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import React, { useEffect, useState } from "react";
import BlogLoading from "./BlogLoading";
import Checkout from "@/components/stripe/Checkout";

export default function BlogContent({ blogId }: { blogId: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [blog, setBlog] = useState<{
		blog_id: string;
		content: string;
		created_at: string;
	} | null>();
	// RLS hides the row (rather than returning an empty one) for gated
	// content, so Supabase reports it the same way as a real failure: a
	// PostgREST "no rows" error (PGRST116, surfaced as a 406). Track it
	// separately so a transient/network error doesn't get shown as a paywall.
	const [loadFailed, setLoadFailed] = useState(false);
	const supabase = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const readBlogContent = async () => {
		const { data, error } = await supabase
			.from("blog_content")
			.select("*")
			.eq("blog_id", blogId)
			.single();
		setBlog(data);
		setLoadFailed(!!error && error.code !== "PGRST116");
		setIsLoading(false);
	};

	//TODO: Change this to use React Query instead? UseEffect w/ fetch = bad
	useEffect(() => {
		readBlogContent();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isLoading) {
		return <BlogLoading />;
	}
	if (loadFailed) {
		return (
			<div className="flex items-center justify-center h-96 text-center">
				<p className="text-muted-foreground">Something went wrong loading this post. Please try again.</p>
			</div>
		);
	}
	if (!blog?.content) {
		return <Checkout />;
	}

	return <MarkdownPreview className="sm:px-10" content={blog?.content || ""} />;
}
