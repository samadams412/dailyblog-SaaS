"use client";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import React from "react";

export default function SwitchForm({
	checked,
	onSubmit,
    name
}: {
	checked: boolean;
	onSubmit: () => Promise<string>; //deleteByBlogId returns a Promise<string> 
    name: string;
}) {
	const handleOnSubmit = async (e:any) => {
        e.preventDefault();
        const {error} = JSON.parse(await onSubmit())
        if (error?.message) {
            toast({
                title: "Fail to update " + name,
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{error?.message}</code>
                    </pre>
                ),
            });
        } else {
            toast({
                title: "Successfully updated " + name,
            });
        }
    };

	return (
		<form onSubmit={handleOnSubmit}>
			<Switch checked={checked} type="submit" className="bg-blue-500"/>
		</form>
	);
}
