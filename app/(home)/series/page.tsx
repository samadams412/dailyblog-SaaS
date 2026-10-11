import Image from "next/image";
import Link from "next/link";
import { readSeriesWithPreview } from "@/lib/actions/series";

export const metadata = {
	title: "Series",
};

export default async function SeriesIndexPage() {
	const series = await readSeriesWithPreview();

	return (
		<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 p-5 xl:p-0">
			{series.length ? (
				series.map((s) => (
					<Link
						key={s.id}
						href={"/series/" + s.slug}
						className="w-full border border-border rounded-md bg-card p-5 hover:ring-2 ring-primary transition-all cursor-pointer space-y-5"
					>
						<div className="relative w-full h-72 md:h-64 xl:h-96 bg-secondary rounded-md overflow-hidden">
							{s.previewPost ? (
								<Image
									src={s.previewPost.image_url}
									alt="cover"
									fill
									className="object-cover object-center"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px): 50vw, 33vw"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-muted-foreground">
									No posts yet
								</div>
							)}
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between gap-2">
								<h1 className="text-xl font-display font-bold">{s.title}</h1>
								<span className="text-sm text-muted-foreground whitespace-nowrap">
									{s.postCount} {s.postCount === 1 ? "post" : "posts"}
								</span>
							</div>
							{s.description && (
								<p className="text-sm text-muted-foreground line-clamp-2">
									{s.description}
								</p>
							)}
						</div>
					</Link>
				))
			) : (
				<h1 className="text-muted-foreground">No series yet.</h1>
			)}
		</div>
	);
}
