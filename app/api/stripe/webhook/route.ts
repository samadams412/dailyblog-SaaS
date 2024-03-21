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
		case "payment_intent.succeeded":
			const paymentIntentSucceeded = event.data.object
			console.log(paymentIntentSucceeded);
			
			// const subscription = await stripe.subscriptions.list({
			// 	customer: customer.id,
			// });
			// if (subscription.data.length) {
			// 	const sub = subscription.data[0];
			// 	//call to supabase and update user table
			// 	await onSuccessSubscription();
			// }

			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}
	return Response.json({});
}

const onSuccessSubscription = async () => {
	console.log("update user table");
};
