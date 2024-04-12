export type IBlogDetail = {
	created_at: string;
	category: string,
	id: string;
	image_url: string;
	is_premium: boolean;
	is_published: boolean;
	title: string;
	blog_content: {
		blog_id: string;
		content: string;
		created_at: string;
	};
} | null;

export type IBlog = {
	id: string;
	title: string;
	image_url: string;
	category: string,
	created_at: string;
	is_premium: boolean;
	content: string;
	is_published: boolean;
};

export type IUser = {
	created_at: string;
	display_name: string;
	email: string;
	id: string;
	image_url: string;
	role: string;
	stripe_customer_id: string | null;
	stripe_subscription_id: string | null;
	subscriptions_status: boolean;
} | null;
