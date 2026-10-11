"use client";

import { useState } from "react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { reorderSeriesPosts } from "@/lib/actions/series";
import { Tables } from "@/lib/types/supabase";
import { cn } from "@/lib/utils";

function SortablePostRow({ post }: { post: Tables<"blog"> }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: post.id });

	return (
		<li
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(
				"flex items-center gap-3 border rounded-md p-3 bg-background",
				isDragging && "opacity-50"
			)}
		>
			<button
				{...attributes}
				{...listeners}
				className="cursor-grab touch-none text-muted-foreground"
				aria-label="Drag to reorder"
			>
				<DragHandleDots2Icon />
			</button>
			<span className="flex-1">{post.title}</span>
			{!post.is_published && (
				<span className="text-xs text-muted-foreground">Draft</span>
			)}
		</li>
	);
}

export default function SeriesReorder({
	seriesId,
	initialPosts,
}: {
	seriesId: string;
	initialPosts: Tables<"blog">[];
}) {
	const [posts, setPosts] = useState(initialPosts);
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const sensors = useSensors(useSensor(PointerSensor));

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setPosts((current) => {
			const oldIndex = current.findIndex((p) => p.id === active.id);
			const newIndex = current.findIndex((p) => p.id === over.id);
			return arrayMove(current, oldIndex, newIndex);
		});
		setIsDirty(true);
	}

	async function handleSave() {
		setIsSaving(true);
		const result = JSON.parse(
			await reorderSeriesPosts(seriesId, posts.map((p) => p.id))
		);
		setIsSaving(false);
		if (result.error) {
			toast({ title: "Failed to save order.", description: result.error.message });
			return;
		}
		setIsDirty(false);
		toast({ title: "Order saved." });
	}

	if (!posts.length) {
		return <p className="text-muted-foreground">No posts in this series yet.</p>;
	}

	return (
		<div className="space-y-4">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={posts.map((p) => p.id)}
					strategy={verticalListSortingStrategy}
				>
					<ul className="space-y-2">
						{posts.map((post) => (
							<SortablePostRow key={post.id} post={post} />
						))}
					</ul>
				</SortableContext>
			</DndContext>
			<Button onClick={handleSave} disabled={!isDirty || isSaving}>
				{isSaving ? "Saving…" : "Save order"}
			</Button>
		</div>
	);
}
