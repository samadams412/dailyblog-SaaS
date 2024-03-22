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
	const supabase = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const readBlogContent = async () => {
		const { data } = await supabase
			.from("blog_content")
			.select("*")
			.eq("blog_id", blogId)
			.single();
		setBlog(data);
		setIsLoading(false);
	};

    
	//TODO: Change this to use React Query instead? UseEffect w/ fetch = bad
	useEffect(() => {
        readBlogContent();
	}, []);
    
    if(isLoading){
        return <BlogLoading/>
    }
	//ISSUE: Partial Data Loading leads to fetch 406 error 
	// Not subscribed user can view static blog data  like title/img but not dynamic blog_content that is premium
    if(!blog?.content){
        return <Checkout/>
    }
    
	return <MarkdownPreview className="sm:px-10" content={blog?.content || ""} />;
}
