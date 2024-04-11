import { Database } from "@/lib/types/supabase";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
	try {
		const supabase = createClient<Database>(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (id === "*") {
			const result = await supabase.from("blog").select("id").limit(10);
			return new Response(JSON.stringify(result));
		} else if (id) {
			const result = await supabase
				.from("blog")
				.select("*")
				.eq("id", id)
				.single();
			return new Response(JSON.stringify(result));
		}

		return new Response(JSON.stringify({}));
	} catch (error) {
		//console.error("Error fetching data from Supabase:", error);
		return new Response(
			"An error occurred while fetching data from Supabase.",
			{ status: 500 }
		);
	}
}
