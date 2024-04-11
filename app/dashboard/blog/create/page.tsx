"use client";
import React from "react";
import BlogForm from "../../components/BlogForm";
import { BlogFormSchemaType } from "../../schema";
import { defaultCreateBlog } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";
import { createBlog } from "@/lib/actions/blog";
import { useRouter } from "next/navigation";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export default function CreateForm() {
	const router = useRouter();

	const onHandleSubmit = async (data: BlogFormSchemaType) => {
		const result = JSON.parse(await createBlog(data));

		const { error } = result as PostgrestSingleResponse<null>;
		if (error?.message) {
			toast({
				title: "Failed to create post.",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{error.message}</code>
					</pre>
				),
			});
		} else {
			toast({
				title: "Successfully created post.",
				description: data.title,
			});
			router.push("/dashboard");
		}
	};

	return (
		<BlogForm
			onHandleSubmit={onHandleSubmit}
			defaultBlog={defaultCreateBlog}
		/>
	);
}
