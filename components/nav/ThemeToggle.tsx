"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";

export default function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	// next-themes only knows the resolved theme after mount; avoid a
	// server/client icon mismatch by rendering a placeholder until then.
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label="Toggle theme"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			{mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
		</Button>
	);
}
