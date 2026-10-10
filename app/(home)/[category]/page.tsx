import { readBlogsByCategory } from "@/lib/actions/blog";
import { CATEGORIES } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function Page({
	params,
}: {
	params: { category: string };
}) {
	const category = CATEGORIES.find((c) => c.slug === params.category);
	if (!category) {
		notFound();
	}

	let blogs = await readBlogsByCategory(category.label);

	if (!blogs) {
		blogs = [];
	}

	return (
		<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 p-5 xl:p-0">
			{blogs.length ? (
				blogs.map((blog, index) => (
					<Link
						key={index}
						href={"/blog/" + blog.id}
						className="w-full border border-border rounded-md bg-card p-5 hover:ring-2 ring-primary transition-all cursor-pointer space-y-5"
					>
						<div className="relative w-full h-72 md:h-64 xl:h-96">
							<Image
								priority
								src={blog.image_url}
								alt="cover"
								fill
								className="object-cover object-center"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px): 50vw, 33vw"
							/>
						</div>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">
								{new Date(blog.created_at).toDateString()}
							</p>
							<h1 className="text-xl font-display font-bold">{blog.title}</h1>
						</div>
					</Link>
				))
			) : (
				<h1 className="text-muted-foreground">No blogs with this category yet.</h1>
			)}
		</div>
	);
}
