import { Database } from "@/lib/types/supabase";
import { createClient } from "@supabase/supabase-js";
//I want to create a static page when a single blog is selected 
//have to fetch the data from Supabase
export async function GET(request: Request) {
	//add Database type to help intellisense
	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const { searchParams } = new URL(request.url);

	const id = searchParams.get("id");

	if (id === "*") {
		const result = await supabase.from("blog").select("id").limit(10);
		return Response.json({ ...result });
	} else if (id) {
		const result = await supabase.from("blog").select("*").eq("id", id).single();
		return Response.json({ ...result });
	}
    return Response.json({});
}
