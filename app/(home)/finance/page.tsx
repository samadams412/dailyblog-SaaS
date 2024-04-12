import { readBlogsByCategory } from "@/lib/actions/blog";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
	const category = "Finance"; // Change this to the desired category

	let blogs = await readBlogsByCategory(category);

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
						className="w-full border rounded-md bg-gradient-dark p-5 hover:ring-2 ring-blue-400 transition-all cursor-pointer space-y-5 first:lg:col-span-2 first:xl:col-span-3"
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
							<p className="text-sm text-gray-400">
								{new Date(blog.created_at).toDateString()}
							</p>
							<h1 className="text-xl font-bold">{blog.title}</h1>
						</div>
					</Link>
				))
			) : (
				<h1>No blogs with this category yet.</h1>
			)}
		</div>
	);
}
