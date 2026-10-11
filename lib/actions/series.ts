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
