import { createSupabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";
import { buffer } from "node:stream/consumers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK_KEY!);

const endpointSecret = process.env.ENDPOINT_SECRET!;

export async function POST(req: any) {
	let event;
	const rawBody = await buffer(req.body);

	try {
		const sig = headers().get("stripe-signature");

		event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
	} catch (err: any) {
		return Response.json({ error: "Webhook error " + err?.message });
	}

	switch (event.type) {
		case "customer.updated":
			const customer = event.data.object;

			const subscription = await stripe.subscriptions.list({
				customer: customer.id,
			});
			if (subscription.data.length) {
				const sub = subscription.data[0];
				//call to supabase and update user table

				onSuccessSubscription(sub.status==="active", sub.id, customer.id, customer.email!);
			}

			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}
	return Response.json({});
}

const onSuccessSubscription = async (
	subscriptions_status: boolean,
	stripe_customer_id: string,
	stripe_subscription_id: string,
	email: string
) => {
	const supabaseAdmin = await createSupabaseAdmin();
	//Update user from their email
	return await supabaseAdmin
		.from("users")
		.update({
			subscriptions_status,
			stripe_customer_id,
			stripe_subscription_id,
		})
		.eq("email", email);
};
