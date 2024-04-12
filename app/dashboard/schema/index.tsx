import * as z from "zod";

const allowedDomains = [
    "avatars.githubusercontent.com",
    "images.unsplash.com",
    "unsplash.com",
    "source.unsplash.com",
    "as2.ftcdn.net"
];

// Define the list of allowed categories
const allowedCategories = ["Coding", "Gaming", "Technology", "Design", "Others", "Finance"];

// Extend the existing BlogFormSchema
export const BlogFormSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
    image_url: z.string().url({ message: "Invalid URL" }),
    content: z.string().min(2, {
        message: "Content must be at least 2 characters.",
    }),
    is_published: z.boolean(),
    is_premium: z.boolean(),
    category: z.string().optional().refine((value) => {
        // Ensure the selected category is one of the allowed categories
        return allowedCategories.includes(value!);
    }, {
        message: "Invalid category selected.",
        path: ["category"]
    })
})
    .refine((data) => {
        const image_url = data.image_url;
        try {
            const url = new URL(image_url);
            return allowedDomains.includes(url.hostname);
        } catch {
            return false;
        }
    }, {
        message: "Currently only images from Unsplash are supported.",
        path: ["image_url"],
    });

// Define the type for the schema
export type BlogFormSchemaType = z.infer<typeof BlogFormSchema>;
