import type { Metadata } from "next";
import { Public_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/nav/Navbar";
import SessionProvider from "@/components/Session-provider";
import { Toaster } from "@/components/ui/toaster";


const publicSans = Public_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
});
const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	variable: "--font-display",
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.SITE_URL!),
	title: {
		template: "%s | Sams Daily Blog",
		default: "Sams Daily Blog",
	},
	description: "My blog to discuss all the content.",
	openGraph: {
		title: "Sam's Daily Blog",
		url: process.env.SITE_URL,
		siteName: "Sam's Daily Blog",
		images: "/site_image.JPG",
		type: "website",
	},
	keywords: ["Sam's Blog", "Coding"],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${publicSans.variable} ${spaceGrotesk.variable} font-sans`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main className="max-w-7xl mx-auto p-10 space-y-10">
						<Navbar></Navbar>
						{children}
					</main>
					<Toaster />
				</ThemeProvider>
				<SessionProvider />
			
			</body>
		</html>
	);
}
