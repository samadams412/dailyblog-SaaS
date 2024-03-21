import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useUser } from "@/lib/store/user";
import LoginForm from "../nav/LoginForm";
import { checkout } from "@/lib/actions/stripe";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
export default function Checkout() {
	const pathname = usePathname();
	const user = useUser((state) => state.user);
	const [isPending, startTransition] = useTransition();

	if (!user?.id) {
		return (
			<div className="flex items-center h-96 justify-center gap-2">
				<LoginForm /> to view this content.
			</div>
		);
	}

	const handleCheckout = (e: any) => {
		e.preventDefault();
		startTransition(async () => {
			const data = JSON.parse(
				await checkout(user?.user_metadata?.email!, location.origin+pathname)
			);
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
            await stripe?.redirectToCheckout({sessionId: data.id})
		});
	};

	return (
		<form
			onSubmit={handleCheckout}
			className={cn("h-96 w-full flex items-center justify-center", {
				"animate-pulse": isPending,
			})}
		>
			<Button
				variant="ghost"
				className="flex flex-col p-10 gap-5 ring-2 ring-blue-500"
			>
				<span className="flex items-center gap-2 text-2xl font-bold text-blue-500">
					<LightningBoltIcon
						className={cn(
							"w-5 h-5",
							!isPending ? "animate-bounce" : "animate-spin"
						)}
					/>
					Upgrade to Premium
				</span>
				<span>Unlock Premium Blog Content</span>
			</Button>
		</form>
	);
}
