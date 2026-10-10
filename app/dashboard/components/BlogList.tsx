"use client";
import { useMemo, useState } from "react";
import { EyeOpenIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { CATEGORIES } from "@/lib/categories";
import SwitchForm from "./SwitchForm";
import DeleteAlert from "./DeleteAlert";
import type { BlogRow } from "./BlogTable";

type Row = BlogRow;

type StatusFilter = "all" | "published" | "draft";
type PremiumFilter = "all" | "premium" | "free";

export default function BlogList({ rows }: { rows: Row[] }) {
	const [category, setCategory] = useState<string>("all");
	const [status, setStatus] = useState<StatusFilter>("all");
	const [premium, setPremium] = useState<PremiumFilter>("all");

	const filteredRows = useMemo(() => {
		return rows.filter(({ blog }) => {
			if (category !== "all" && blog.category !== category) return false;
			if (status === "published" && !blog.is_published) return false;
			if (status === "draft" && blog.is_published) return false;
			if (premium === "premium" && !blog.is_premium) return false;
			if (premium === "free" && blog.is_premium) return false;
			return true;
		});
	}, [rows, category, status, premium]);

	const selectClass =
		"border border-input bg-background rounded-md px-2 py-1.5 text-sm";

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-3 flex-wrap">
				<select
					className={selectClass}
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				>
					<option value="all">All categories</option>
					{CATEGORIES.map((c) => (
						<option key={c.slug} value={c.label}>
							{c.label}
						</option>
					))}
				</select>
				<select
					className={selectClass}
					value={status}
					onChange={(e) => setStatus(e.target.value as StatusFilter)}
				>
					<option value="all">All statuses</option>
					<option value="published">Published</option>
					<option value="draft">Draft</option>
				</select>
				<select
					className={selectClass}
					value={premium}
					onChange={(e) => setPremium(e.target.value as PremiumFilter)}
				>
					<option value="all">Premium & free</option>
					<option value="premium">Premium only</option>
					<option value="free">Free only</option>
				</select>
			</div>

			<div className="rounded-md bg-card border-[0.5px] border-border overflow-y-scroll">
				<div className="w-[800px] md:w-full">
					<div className="grid grid-cols-5 border-b border-border p-5 text-muted-foreground">
						<h1 className=" col-span-2">Title</h1>
						<h1>Premium</h1>
						<h1>Publish</h1>
					</div>
					{filteredRows.length ? (
						<div className="space-y-10 p-5">
							{filteredRows.map(({ blog, updatePremium, updatePublished }) => (
								<div className="grid grid-cols-5" key={blog.id}>
									<h1 className="text-card-foreground col-span-2 font-lg font-medium">
										{blog.title}
										<p className="text-sm text-muted-foreground">
											{new Date(blog.created_at).toLocaleDateString("en-US", {
												year: "numeric",
												month: "2-digit",
												day: "2-digit",
											})}
										</p>
									</h1>

									<SwitchForm
										checked={blog.is_premium}
										onSubmit={updatePremium}
										name="premium"
									/>

									<SwitchForm
										checked={blog.is_published}
										onSubmit={updatePublished}
										name="publish"
									/>

									<Actions id={blog.id} />
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground p-5">
							No posts match these filters.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

const Actions = ({ id }: { id: string }) => {
	return (
		<div className="flex items-center gap-2 md:flex-wrap">
			<Link href={`/blog/${id}`}>
				<Button className="flex gap-2 items-center" variant="outline">
					<EyeOpenIcon />
					View
				</Button>
			</Link>
			<DeleteAlert id={id} />

			<Link href={`/dashboard/blog/edit/${id}`}>
				<Button className="flex gap-2 items-center" variant="outline">
					<Pencil1Icon />
					Edit
				</Button>
			</Link>
		</div>
	);
};
