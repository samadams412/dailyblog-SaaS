import { IBlogDetail } from "./types";

export const blogDeafultValue = `
## Azeroth Chronicles: Tales from the World of Warcraft

As we embark on the journey of a Tauren Warrior, starting from humble beginnings in the verdant plains of Mulgore, let's reminisce about the moments of fortune that have illuminated our adventures. Amidst the clashes with monstrous foes and the unraveling of ancient mysteries, there are instances that sparkle with unexpected delight. The code excerpt below captures one such instance, transcribed in the language of the arcane:

\`\`\`js @app/lib/fortuneMoments.js
const fortuneMoments = [
  "Defeating a fearsome quillboar chieftain and liberating Thunderhorn Water Well",
  "Rescuing a stranded caravan from the relentless attacks of marauding harpies",
  "Discovering a hidden cave filled with ancient artifacts and guarded by ferocious beasts"
];

const randomFortune = fortuneMoments[Math.floor(Math.random() * fortuneMoments.length)];
console.log('Fortune shines upon us: ' + randomFortune);
\`\`\`

In the vast expanse of Azeroth, every shadow conceals the promise of adventure and every whisper carries the hint of treasure. For our Tauren Warrior, from the tranquil plains of Mulgore to the bustling Thunderhoof

`;

export const blogs = [
	{
		id: `1`,
		title: "Random Blog Adventures",
		image_url:
			"https://images.unsplash.com/photo-1700164805522-c3f2f8885144?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		created_at: "2023-05-15",
		is_premium: true,
		is_published: true,
		content: blogDeafultValue,
	},
	{
		id: "2",
		title: "Exploring the Unknown: A Random Blog Journey",
		image_url:
			"https://images.unsplash.com/photo-1700130862148-8bea5f545bfe?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

		created_at: "2023-06-22",
		is_premium: false,
		is_published: false,

		content: blogDeafultValue,
	},
	{
		id: "3",
		title: "City Lights at Night",
		image_url:
			"https://images.unsplash.com/photo-1699968237129-b8d83b25ecd9?q=80&w=3557&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

		created_at: "2023-08-10",
		is_premium: false,
		is_published: false,
		content: blogDeafultValue,
	},
	{
		id: "4",
		title: "Unleashing Creativity: The Surprising Benefits of Doodling",
		image_url:
			"https://images.unsplash.com/photo-1699100329878-7f28bb780787?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		created_at: "2023-10-05",
		is_premium: true,
		is_published: false,

		content: blogDeafultValue,
	},
	{
		id: "5",
		title: "Unleashing Creativity: The Surprising Benefits of Doodling",
		image_url:
			"https://images.unsplash.com/photo-1700316740839-f5afe22536e4?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		created_at: "2023-10-05",
		is_premium: false,
		is_published: false,
		content: blogDeafultValue,
	},
];

export const defaultCreateBlog: IBlogDetail = {
	id: "",
	title: "",
	image_url: "",
	created_at: "",
	is_premium: false,
	is_published: false,
	blog_content: {
		created_at: "",
		content: "",
		blog_id: "",
	},
};
export const users = [
	{
		display_name: "John Doe",
		image_url: "/profile.png",
		subscription_status: "Active",
		customer_id: "123456",
		email: "john.doe@example.com",
	},
	{
		display_name: "Alice Smith",
		image_url: "/profile.png",
		subscription_status: "Inactive",
		customer_id: "789012",
		email: "alice.smith@example.com",
	},
	{
		display_name: "Bob Johnson",
		image_url: "/profile.png",
		subscription_status: "Active",
		customer_id: "345678",
		email: "bob.johnson@example.com",
	},
	{
		display_name: "Eva Brown",
		image_url: "/profile.png",
		subscription_status: "Active",
		customer_id: "901234",
		email: "eva.brown@example.com",
	},
];
