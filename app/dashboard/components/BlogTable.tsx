import { IBlog } from "@/lib/types";
import { readBlogAdmin, updateBlogById } from "@/lib/actions/blog";
import BlogList from "./BlogList";

export default async function BlogTable() {
	const { data: blogs } = await readBlogAdmin();

	// Bind each row's update action server-side (as before) and hand the
	// client component plain data plus ready-to-call actions, since
	// filtering/selection state can't live in a server component.
	const rows = (blogs ?? []).map((blog) => ({
		blog,
		updatePremium: updateBlogById.bind(null, blog.id, {
			is_premium: !blog.is_premium,
		} as IBlog),
		updatePublished: updateBlogById.bind(null, blog.id, {
			is_published: !blog.is_published,
		} as IBlog),
	}));

	return <BlogList rows={rows} />;
}

export type BlogRow = ReturnType<typeof readBlogAdmin> extends Promise<{
	data: (infer T)[] | null;
}>
	? { blog: T; updatePremium: () => Promise<string>; updatePublished: () => Promise<string> }
	: never;
