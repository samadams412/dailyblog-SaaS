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
		return Response.json(
			{ error: "Webhook error " + err?.message },
			{ status: 400 }
		);
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			if (session.mode !== "subscription" || !session.subscription) {
				break;
			}
			const email = session.customer_details?.email ?? session.customer_email;
			if (!email) {
				console.error(`checkout.session.completed ${session.id} has no email on file`);
				break;
			}

			const { error, data } = await onSuccessSubscription(
				true,
				session.subscription as string,
				session.customer as string,
				email
			);
			if (error?.message) {
				return Response.json(
					{ error: "Unable to activate subscription: " + error.message },
					{ status: 500 }
				);
			}
			if (!data?.length) {
				console.error(`No user row matched email ${email} for checkout session ${session.id}`);
				return Response.json(
					{ error: "No user matched this checkout session's email." },
					{ status: 500 }
				);
			}
			break;
		}

		case "customer.subscription.updated": {
			const sub = event.data.object as Stripe.Subscription;
			const customer = await stripe.customers.retrieve(sub.customer as string);
			if (customer.deleted) {
				console.error(`Stripe customer ${sub.customer} was deleted; cannot sync subscription ${sub.id}`);
				break;
			}
			if (!customer.email) {
				console.error(`Stripe customer ${sub.customer} has no email; cannot sync subscription ${sub.id}`);
				break;
			}

			const { error, data } = await onSuccessSubscription(
				sub.status === "active",
				sub.id,
				sub.customer as string,
				customer.email
			);
			if (error?.message) {
				return Response.json(
					{ error: "Unable to sync subscription: " + error.message },
					{ status: 500 }
				);
			}
			if (!data?.length) {
				console.error(`No user row matched email ${customer.email} for subscription ${sub.id}`);
				return Response.json(
					{ error: "No user matched this subscription's email." },
					{ status: 500 }
				);
			}
			break;
		}

		case "customer.subscription.deleted": {
			const deleteSub = event.data.object as Stripe.Subscription;
			const { error, data } = await onCancelSubscription(false, deleteSub.id);
			if (error?.message) {
				return Response.json(
					{ error: "Failed to cancel subscription: " + error.message },
					{ status: 500 }
				);
			}
			if (!data?.length) {
				console.error(`No user row matched subscription ${deleteSub.id} for cancellation`);
				return Response.json(
					{ error: "No user matched this subscription for cancellation." },
					{ status: 500 }
				);
			}
			break;
		}

		default:
			console.log(`Unhandled event type ${event.type}`);
	}
	return Response.json({});
}

const onCancelSubscription = async (
	subscriptions_status: boolean,
	sub_id: string
) => {
	const supabaseAdmin = await createSupabaseAdmin();
	return await supabaseAdmin
		.from("users")
		.update({
			subscriptions_status,
			stripe_customer_id: null,
			stripe_subscription_id: null,
		})
		.eq("stripe_subscription_id", sub_id)
		.select("id");
};

const onSuccessSubscription = async (
	subscriptions_status: boolean,
	stripe_subscription_id: string,
	stripe_customer_id: string,
	email: string
) => {
	const supabaseAdmin = await createSupabaseAdmin();
	//Update user from their email
	return await supabaseAdmin
		.from("users")
		.update({
			subscriptions_status,
			stripe_subscription_id,
			stripe_customer_id,
		})
		.eq("email", email)
		.select("id");
};
