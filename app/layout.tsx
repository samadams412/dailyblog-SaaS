import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/nav/Navbar";
import SessionProvider from "@/components/Session-provider";
import { Toaster } from "@/components/ui/toaster";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
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
