import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { readPostsBySeries, readSeriesBySlug } from "@/lib/actions/series";

// Plain client, not the cookie-based server client: generateStaticParams runs
// at build time, outside a request scope (same pattern as blog/[id]/page.tsx).
export async function generateStaticParams() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const { data: series } = await supabase.from("series").select("slug");
	return (series ?? []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
	const { data: series } = await readSeriesBySlug(params.slug);
	return {
		title: series?.title,
		description: series?.description ?? undefined,
	};
}

export default async function SeriesDetailPage({
	params,
}: {
	params: { slug: string };
}) {
	const { data: series } = await readSeriesBySlug(params.slug);
	if (!series) {
		notFound();
	}

	const posts = await readPostsBySeries(series.id);

	return (
		<div className="max-w-5xl mx-auto space-y-10 p-5 xl:p-0">
			<div className="space-y-2">
				<h1 className="text-3xl font-display font-bold">{series.title}</h1>
				{series.description && (
					<p className="text-muted-foreground">{series.description}</p>
				)}
			</div>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
				{posts.length ? (
					posts.map((post, index) => (
						<Link
							key={post.id}
							href={"/blog/" + post.id}
							className="w-full border border-border rounded-md bg-card p-5 hover:ring-2 ring-primary transition-all cursor-pointer space-y-5"
						>
							<div className="relative w-full h-72 md:h-64 xl:h-96">
								<Image
									src={post.image_url}
									alt="cover"
									fill
									className="object-cover object-center"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px): 50vw, 33vw"
								/>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">
									Part {index + 1} of {posts.length}
								</p>
								<h1 className="text-xl font-display font-bold">{post.title}</h1>
							</div>
						</Link>
					))
				) : (
					<h1 className="text-muted-foreground">No posts in this series yet.</h1>
				)}
			</div>
		</div>
	);
}
