import { notFound } from "next/navigation";
import { readSeriesById, readSeriesPostsAdmin } from "@/lib/actions/series";
import SeriesEditForm from "./components/SeriesEditForm";
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
			<SeriesEditForm series={series} />
			<SeriesReorder seriesId={series.id} initialPosts={posts ?? []} />
		</div>
	);
}
