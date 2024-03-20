import { Button } from "@/components/ui/button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

import React from "react";
import { readBlog } from "@/lib/actions/blog";
import DeleteAlert from "./DeleteAlert";

export default async function BlogTable() {
	const { data: blogs } = await readBlog();

	return (
		<div className="overflow-x-auto">
			<div className="border bg-graident-dark rounded-md w-[900px] md:w-full">
				{/* table header */}
				<div className="grid grid-cols-5 p-5 text-gray-500 border-b">
					<h1 className="col-span-2">Title</h1>
					<h1>Premium</h1>
					<h1>Publish</h1>
				</div>
                {/* map over each blog in our database */}
				{blogs?.map((blog, index) => {
					return (
						<div className="grid grid-cols-5 p-5" key={index}>
							<h1 className="col-span-2">{blog.title}</h1>
							<Switch checked={blog.is_premium} />
							<Switch checked={blog.is_published} />
							<Actions id={blog.id}/>
						</div>
					);
				})}
				{/* table content */}
			</div>
		</div>
	);
}
// View, Delete, Edit button components inside of the BlogTable component:
const Actions = ({id}:{id:string}) => {
	return (
		<div className="flex items-center gap-2 flex-wrap">
			<Button variant="outline" className="flex items-center gap-2">
				<EyeOpenIcon />
				View
			</Button>
			<DeleteAlert id={id} />
			<Button variant="outline" className="flex items-center gap-2">
				<PencilIcon />
				Edit
			</Button>
		</div>
	);
};
