"use server";

import { BlogFormSchemaType } from "@/app/dashboard/schema";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";
import { revalidatePath } from "next/cache";
const cookieStore = cookies();
const DASHBOARD = "/dashboard"
const supabase = createServerClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	{
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
		},
	}
);

export async function createBlog(data: BlogFormSchemaType) {
	//need to exclude content because we dont have it
	const { ["content"]: excludedKey, ...blog } = data;
	const resultBlog = await supabase
		.from("blog")
		.insert(blog)
		.select("id")
		.single();
	if (resultBlog.error) {
		return JSON.stringify(resultBlog);
	} else {
		const result = await supabase
			.from("blog_content")
			.insert({ blog_id: resultBlog.data.id!, content: data.content });
		//revalidation needed
        revalidatePath(DASHBOARD);
		return JSON.stringify(result);
	}
}

export async function readBlog() {
	//read from blog table select all and sort ascending by time created
	//starting to like supabase
	return supabase
		.from("blog")
		.select("*")
		.order("created_at", { ascending: true });
}

export async function deleteBlogById(blogId: string) {
	const result = await supabase.from("blog").delete().eq("id", blogId);
    revalidatePath(DASHBOARD);
	return JSON.stringify(result);
}
