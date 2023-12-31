"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from "zod"; //zod is js library that does runtime checking of object structures, validation and schema defintions in Typescript projects
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import {
    EyeOpenIcon,
    Pencil1Icon,
    RocketIcon,
    StarIcon,
    } from "@radix-ui/react-icons";
    import { BsCopy, BsSave } from "react-icons/bs";
    import { useState } from "react";
    import { cn } from "@/lib/utils";
    import { Textarea } from "@/components/ui/textarea";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
    //zod schema to validate form
    const formSchema = z.object({
        title: z.string().min(3, {
            message: "Title must be at least 3 characters.",
        }),
        image_url: z.string().url({ message: "invalid url" }),
        content: z.string().min(2, {
            message: "Content must be at least 2 characters.",
        }),
        is_published: z.boolean(),
        is_premium: z.boolean(),
    });

    export default function BlogForm() {
        const [isPreview, setIsPreview] = useState(false);
        // 1. Define your form.
        const form = useForm<z.infer<typeof formSchema>>({
            mode: "all",
            resolver: zodResolver(formSchema),
            defaultValues: {
            //create default values to use for 'name' in the form
            title: "",
            image_url: "",
            content: "",
            is_published: true,
            is_premium: false,
            },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // kinda a pain to set all this up for a form but atleast its type safe...
        console.log(values);
    }
    return (
        <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full border rounded-md"
        >
            <div className="p-5 flex items-center flex-wrap justify-between border-b gap-5">
            <div className="flex items-center gap-5 flex-wrap">
                <span
                onClick={() => setIsPreview(!isPreview)}
                role="button"
                tabIndex={0}
                className="flex items-center gap-1 border bg-zinc-700 p-2 rounded-md hover:ring-2 hover:ring-zinc-400 transition-all"
                >
                {isPreview ? (
                    <>
                    <Pencil1Icon />
                    Edit
                    </>
                ) : (
                    <>
                    <EyeOpenIcon />
                    Preview
                    </>
                )}
                </span>
                {/* Premium Checkbox */}
                <FormField
                control={form.control}
                name="is_premium"
                render={({ field }) => (
                    <FormItem>
                    <FormControl className="flex gap-1 border bg-zinc-700 p-2 rounded-md items-center">
                        <div>
                        <StarIcon />
                        <span>Premium</span>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </div>
                    </FormControl>
                    </FormItem>
                )}
                />
                {/* Publish Checkbox */}
                <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                    <FormItem>
                    <FormControl className="flex gap-1 border bg-zinc-700 p-2 rounded-md items-center">
                        <div>
                        <RocketIcon />
                        <span>Publish</span>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </div>
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>
            {/* Save Button initially disabled until form is valid */}
            <Button
                className="flex items-center gap-1"
                disabled={!form.formState.isValid}
            >
                <BsSave />
                Save
            </Button>
            </div>
            {/* Blog Title field */}
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <div
                    className={cn(
                        "p-2 w-full flex break-words gap-2",
                        isPreview ? "divide-x-0" : "divide-x"
                    )}
                    >
                    <Input
                        className={cn(
                        "border-none text-lg font-medium leading-relaxed",
                        isPreview ? "w-0 p-0" : "w-full lg:w-1/2"
                        )}
                        placeholder="Title"
                        {...field}
                    />
                    <div
                        className={cn(
                        "lg:px-10",
                        isPreview
                            ? "mx-auto w-full lg:w-4/5"
                            : "w-1/2 lg:block hidden"
                        )}
                    >
                        <h1 className="text-3xl font-medium">
                        {form.getValues().title}
                        </h1>
                    </div>
                    </div>
                </FormControl>
                {/* only render validation message if user is typing */}
                {form.getFieldState("title").invalid &&
                    form.getValues().title && <FormMessage />}
                </FormItem>
            )}
            />
            {/* Blog Image Field */}
            <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <div
                    className={cn(
                        "p-2 w-full flex break-words gap-2",
                        isPreview ? "divide-x-0" : "divide-x"
                    )}
                    >
                    <Input
                        className={cn(
                        "border-none text-lg font-medium leading-relaxed",
                        isPreview ? "w-0 p-0" : "w-full lg:w-1/2"
                        )}
                        placeholder="Image URL"
                        {...field}
                    />
                    <div
                        className={cn(
                        "lg:px-10",
                        isPreview
                            ? "mx-auto w-full lg:w-4/5"
                            : "w-1/2 lg:block hidden"
                        )}
                    >
                        {!isPreview ? (
                        <>
                            <p>Click on Preview to see image</p>
                        </>
                        ) : (
                        <div className="relative h-80 mt-5 rounded-md border-2">
                            <Image src={form.getValues().image_url} alt="preview" fill className="object-cover object-center border rounded-md"/>
                        </div>
                        )}
                    </div>
                    </div>
                </FormControl>
                {/* only render validation message if user is typing */}
                {form.getFieldState("image_url").invalid &&
                    form.getValues().image_url && (
                    <div className="p-2">
                        <FormMessage />
                    </div>
                    )}
                </FormItem>
            )}
            />
            {/* Blog Content Textarea */}
            <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <div
                    className={cn(
                        "p-2 w-full flex break-words gap-2",
                        isPreview ? "divide-x-0" : "divide-x h-70vh"
                    )}
                    >
                    <Textarea
                        className={cn(
                        "border-none text-lg font-medium leading-relaxed resize-none h-70vh",
                        isPreview ? "w-0 p-0" : "w-full lg:w-1/2"
                        )}
                        placeholder="Content"
                        {...field}
                    />
                    <div
                        className={cn(
                        "lg:px-10",
                        isPreview
                            ? "mx-auto w-full lg:w-4/5"
                            : "w-1/2 lg:block hidden"
                        )}
                    >
                        <MarkdownPreview 
                            content={form.getValues().content} />
                    </div>
                    </div>
                </FormControl>
                {/* only render validation message if user is typing */}
                {form.getFieldState("content").invalid &&
                    form.getValues().content && <FormMessage />}
                </FormItem>
            )}
            />
        </form>
        </Form>
    );
}
