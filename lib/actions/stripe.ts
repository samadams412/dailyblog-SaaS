"use server";

import Stripe from "stripe";
import { createSupabaseServerClient } from "../supabase";

const stripe = new Stripe(process.env.STRIPE_SK_KEY!);

export async function checkout(email: string, redirectTo: string) {
	return JSON.stringify(
		await stripe.checkout.sessions.create({
			success_url: redirectTo || process.env.SITE_URL,
			cancel_url: process.env.SITE_URL,
			customer_email: email,
			line_items: [{ price: process.env.PRO_PRICE_ID, quantity: 1 }],
			mode: "subscription",
		})
	);
}

// Looks up the caller's own stripe_customer_id instead of trusting an argument,
// so one user can't open the billing portal for another user's Stripe customer.
export async function manageBillingPortal() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return JSON.stringify({ error: "Not authorized." });
	}

	const { data: dbUser } = await supabase
		.from("users")
		.select("stripe_customer_id")
		.eq("id", user.id)
		.single();
	if (!dbUser?.stripe_customer_id) {
		return JSON.stringify({ error: "No billing account found." });
	}

	return JSON.stringify(
		await stripe.billingPortal.sessions.create({
			customer: dbUser.stripe_customer_id,
			return_url: process.env.SITE_URL,
		})
	);
}
