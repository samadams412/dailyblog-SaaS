import * as z from "zod"; //zod is js library that does runtime checking of object structures, validation and schema defintions in Typescript projects

const allowedDomains = [
    "avatars.githubusercontent.com",
    "images.unsplash.com",
    "unsplash.com",
    "source.unsplash.com"
];

//zod schema to validate form
export const BlogFormSchema = z
	.object({
		title: z.string().min(3, {
			message: "Title must be at least 3 characters.",
		}),
		image_url: z.string().url({ message: "invalid url" }),
		content: z.string().min(2, {
			message: "Content must be at least 2 characters.",
		}),
		is_published: z.boolean(),
		is_premium: z.boolean(),
	})
	.refine(
		(data) => {
			const image_url = data.image_url;
            console.log(image_url);
            
			try {
				const url = new URL(image_url);
				return allowedDomains.includes(url.hostname);
			} catch {
				return false;
			}
		},
		{
			message: "Currently only images from unsplash are supported.",
			path: ["image_url"],
		}
	);

    export type BlogFormSchemaType = z.infer<typeof BlogFormSchema>