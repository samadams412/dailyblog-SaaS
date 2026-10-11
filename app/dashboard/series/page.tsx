import Link from "next/link";
import { readAllSeries } from "@/lib/actions/series";

export default async function SeriesList() {
	const { data: series } = await readAllSeries();

	return (
		<div className="space-y-5">
			<h1 className="text-2xl font-bold">Series</h1>
			{!series?.length ? (
				<p className="text-muted-foreground">
					No series yet. Create one from a post&apos;s edit page.
				</p>
			) : (
				<ul className="space-y-2">
					{series.map((s) => (
						<li key={s.id}>
							<Link
								href={`/dashboard/series/${s.id}`}
								className="flex items-center justify-between border rounded-md p-3 hover:ring-2 hover:ring-ring transition-all"
							>
								<span className="font-medium">{s.title}</span>
								<span className="text-muted-foreground text-sm">{s.slug}</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
