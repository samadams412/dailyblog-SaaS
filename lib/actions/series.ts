"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../supabase";
import { TablesInsert } from "../types/supabase";
import { requireAdmin } from "./blog";

const DASHBOARD = "/dashboard";

export async function createSeries(data: TablesInsert<"series">) {
	const { supabase, error: authError } = await requireAdmin();
	if (authError) {
		return JSON.stringify({ data: null, error: authError, status: 0, statusText: "" });
	}

	const result = await supabase.from("series").insert(data).select("id").single();
	revalidatePath(DASHBOARD);
	return JSON.stringify(result);
}

export async function readAllSeries() {
	const supabase = await createSupabaseServerClient();
	return supabase.from("series").select("*").order("title", { ascending: true });
}

export async function updatePostSeries(
	blogId: string,
	seriesId: string | null,
	seriesOrder: number | null
) {
	const { supabase, error: authError } = await requireAdmin();
	if (authError) {
		return JSON.stringify({ data: null, error: authError, status: 0, statusText: "" });
	}

	const result = await supabase
		.from("blog")
		.update({ series_id: seriesId, series_order: seriesOrder })
		.eq("id", blogId)
		.select("id");
	if (result.error) {
		return JSON.stringify(result);
	}
	if (!result.data?.length) {
		return JSON.stringify({
			data: null,
			error: {
				message: "Series assignment was not saved. No rows were updated.",
				details: "",
				hint: "",
				code: "NO_ROWS_UPDATED",
			},
			status: 0,
			statusText: "",
		});
	}

	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + blogId);
	return JSON.stringify(result);
}

export async function readPostsBySeries(seriesId: string) {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("blog")
		.select("*")
		.eq("series_id", seriesId)
		.eq("is_published", true)
		.order("series_order", { ascending: true });

	if (error) {
		throw new Error(`Error fetching posts for series "${seriesId}": ${error.message}`);
	}

	return data;
}

export async function readSeriesById(seriesId: string) {
	const supabase = await createSupabaseServerClient();
	return supabase.from("series").select("*").eq("id", seriesId).single();
}

export async function readSeriesBySlug(slug: string) {
	const supabase = await createSupabaseServerClient();
	return supabase.from("series").select("*").eq("slug", slug).single();
}

// One request for the /series index: every series plus its published posts,
// used to derive a post count and a cover-image preview per series.
export async function readSeriesWithPreview() {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("series")
		.select("*, blog(id, title, image_url, series_order, is_published)")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Error fetching series index: ${error.message}`);
	}

	return data.map(({ blog, ...series }) => {
		const publishedPosts = blog
			.filter((post) => post.is_published)
			.sort((a, b) => (a.series_order ?? Infinity) - (b.series_order ?? Infinity));
		return {
			...series,
			postCount: publishedPosts.length,
			previewPost: publishedPosts[0] ?? null,
		};
	});
}

// Admin reorder view needs every post in the series, published or not.
export async function readSeriesPostsAdmin(seriesId: string) {
	const { supabase, error: authError } = await requireAdmin();
	if (authError) {
		return { data: null, error: authError };
	}

	return supabase
		.from("blog")
		.select("*")
		.eq("series_id", seriesId)
		.order("series_order", { ascending: true, nullsFirst: false })
		.order("created_at", { ascending: true });
}

// One upsert call so the whole dragged order is written in a single request,
// not one update per moved post. Upsert replaces the whole row (PostgREST
// sends unlisted columns as null in the VALUES tuple), so the rows must carry
// every column, not just series_order — fetched fresh right before the write.
export async function reorderSeriesPosts(seriesId: string, orderedBlogIds: string[]) {
	const { supabase, error: authError } = await requireAdmin();
	if (authError) {
		return JSON.stringify({ data: null, error: authError, status: 0, statusText: "" });
	}

	const existing = await supabase.from("blog").select("*").in("id", orderedBlogIds);
	if (existing.error) {
		return JSON.stringify(existing);
	}
	const byId = new Map(existing.data.map((row) => [row.id, row]));
	const rows = orderedBlogIds.map((id, index) => {
		const row = byId.get(id);
		if (!row) {
			throw new Error(`Post ${id} not found while reordering series ${seriesId}`);
		}
		return { ...row, series_id: seriesId, series_order: index };
	});
	const result = await supabase.from("blog").upsert(rows).select("id");
	if (result.error) {
		return JSON.stringify(result);
	}
	if (result.data?.length !== orderedBlogIds.length) {
		return JSON.stringify({
			data: null,
			error: {
				message: "Reorder was not fully saved. Not every post was updated.",
				details: "",
				hint: "",
				code: "NO_ROWS_UPDATED",
			},
			status: 0,
			statusText: "",
		});
	}

	revalidatePath(DASHBOARD);
	revalidatePath("/dashboard/series/" + seriesId);
	return JSON.stringify(result);
}
