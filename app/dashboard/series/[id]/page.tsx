import { notFound } from "next/navigation";
import { readSeriesById, readSeriesPostsAdmin } from "@/lib/actions/series";
import SeriesReorder from "./components/SeriesReorder";

export default async function SeriesDetail({
	params,
}: {
	params: { id: string };
}) {
	const [{ data: series }, { data: posts }] = await Promise.all([
		readSeriesById(params.id),
		readSeriesPostsAdmin(params.id),
	]);

	if (!series) {
		notFound();
	}

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-2xl font-bold">{series.title}</h1>
				{series.description && (
					<p className="text-muted-foreground">{series.description}</p>
				)}
			</div>
			<SeriesReorder seriesId={series.id} initialPosts={posts ?? []} />
		</div>
	);
}
