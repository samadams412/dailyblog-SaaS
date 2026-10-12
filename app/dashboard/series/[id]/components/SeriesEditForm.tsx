"use client";

import { useState } from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { updateSeries } from "@/lib/actions/series";
import { Tables } from "@/lib/types/supabase";

export default function SeriesEditForm({ series }: { series: Tables<"series"> }) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [title, setTitle] = useState(series.title);
	const [slug, setSlug] = useState(series.slug);
	const [description, setDescription] = useState(series.description ?? "");

	function cancel() {
		setTitle(series.title);
		setSlug(series.slug);
		setDescription(series.description ?? "");
		setIsEditing(false);
	}

	async function handleSave() {
		setIsSaving(true);
		const result = JSON.parse(
			await updateSeries(series.id, { title, slug, description: description || null })
		);
		setIsSaving(false);
		if (result.error) {
			toast({ title: "Failed to save series.", description: result.error.message });
			return;
		}
		toast({ title: "Series updated." });
		setIsEditing(false);
	}

	if (!isEditing) {
		return (
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">{title}</h1>
					{description && <p className="text-muted-foreground">{description}</p>}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setIsEditing(true)}
					className="flex items-center gap-1 shrink-0"
				>
					<Pencil1Icon />
					Edit
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 border rounded-md p-3 max-w-md">
			<Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Series title" />
			<Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Series slug" />
			<Textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Short description (optional)"
			/>
			<div className="flex gap-2">
				<Button onClick={handleSave} disabled={isSaving || !title || !slug}>
					{isSaving ? "Saving…" : "Save"}
				</Button>
				<Button variant="outline" onClick={cancel} disabled={isSaving}>
					Cancel
				</Button>
			</div>
		</div>
	);
}
