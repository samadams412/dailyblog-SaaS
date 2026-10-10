// Single source of truth for blog categories, used by the post form, the
// nav menu, and the /[category] routes so they can't drift out of sync.
export const CATEGORIES = [
	{ label: "Gaming", slug: "gaming" },
	{ label: "Coding", slug: "coding" },
	{ label: "Finance", slug: "finance" },
	{ label: "Technology", slug: "technology" },
	{ label: "Others", slug: "others" },
] as const;

export type CategoryLabel = (typeof CATEGORIES)[number]["label"];
