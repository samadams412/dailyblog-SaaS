"use server";
//TODO: Double check all revalidation
import { BlogFormSchemaType } from "@/app/dashboard/schema";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../supabase";

const DASHBOARD = "/dashboard";

// const supabase = createServerClient<Database>(
// 	process.env.NEXT_PUBLIC_SUPABASE_URL!,
// 	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// 	{
// 		cookies: {
// 			get(name: string) {
// 				return cookieStore.get(name)?.value;
// 			},
// 		},
// 	}
// );

export async function createBlog(data: BlogFormSchemaType) {
	//need to exclude content because we dont have it
	const supabase = await createSupabaseServerClient();
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
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("blog")
		.select("*")
		.eq("is_published", true)
		.order("created_at", { ascending: true });
}

export async function deleteBlogById(blogId: string) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("blog").delete().eq("id", blogId);
	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + blogId);
	return JSON.stringify(result);
}

export async function updateBlogById(blogId: string, data: BlogFormSchemaType) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("blog").update(data).eq("id", blogId);
	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + blogId);
	return JSON.stringify(result);
}

export async function readBlogDetailById(blogId: string) {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("blog")
		.select("*, blog_content(*)")
		.eq("id", blogId)
		.single();
}

export async function updateBlogDetailById(
	blogId: string,
	data: BlogFormSchemaType
) {
	const supabase = await createSupabaseServerClient();
	const { ["content"]: excludedKey, ...blog } = data;

	const resultBlog = await supabase.from("blog").update(blog).eq("id", blogId);
	if (resultBlog.error) {
		return JSON.stringify(resultBlog);
	} else {
		const result = await supabase
			.from("blog_content")
			.update({ content: data.content })
			.eq("blog_id", blogId);
		revalidatePath(DASHBOARD);
		return JSON.stringify(result);
	}
}

export async function updateBlogDetail(
	blogId: string,
	data: BlogFormSchemaType
) {
	const { ["content"]: excludedKey, ...blog } = data;

	const supabase = await createSupabaseServerClient();
	const resultBlog = await supabase.from("blog").update(blog).eq("id", blogId);
	if (resultBlog.error) {
		return JSON.stringify(resultBlog);
	} else {
		const result = await supabase
			.from("blog_content")
			.update({ content: data.content })
			.eq("blog_id", blogId);
		revalidatePath(DASHBOARD);
		//this ensurees when we edit a blog it shows the current values when viewing a single blog
		revalidatePath("/blog/" + blogId);

		return JSON.stringify(result);
	}
}

export async function readBlogAdmin() {
	//read from blog table select all and sort ascending by time created
	//starting to like supabase
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("blog")
		.select("*")
		.order("created_at", { ascending: true });
}

export async function readBlogsByCategory(category: string) {
	const supabase = await createSupabaseServerClient();

	// Query blogs filtered by the specified category
	const { data, error } = await supabase
		.from("blog")
		.select("*")
		.eq("is_published", true)
		.eq("category", category)
		.order("created_at", { ascending: true });

	if (error) {
		throw new Error(
			`Error fetching blogs by category "${category}": ${error.message}`
		);
	}

	return data;
}
