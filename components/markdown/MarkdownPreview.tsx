import { cn } from '@/lib/utils'
import React from 'react'
import { icons } from '@/lib/icon'
import Markdown from 'react-markdown'
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/atom-one-dark.css"
import { chdir } from 'process'
import {PiTerminalThin} from "react-icons/pi"
import CopyButton from './CopyButton'
export default function MarkdownPreview({content, className ="sm:p-10"}: {content: string, className?: string}) {
    return (
        <Markdown 
        rehypePlugins={[rehypeHighlight]}
            className={cn(" space-y-6", className)}
            components={{
                h1:({node, ...props}) => {
                    return <h1 {...props} className='text-3xl font-bold my-5'/>
                },
                h2:({node, ...props}) => {
                    return <h1 {...props} className='text-2xl font-bold my-5'/>
                },
                h3:({node, ...props}) => {
                    return <h1 {...props} className='text-xl font-bold my-5'/>
                },
                code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const id = (Math.floor(Math.random() * 100) + 1).toString();
                    if (match?.length) {
                        let Icon = PiTerminalThin;
                        const id = (Math.floor(Math.random() * 100) + 1).toString();
                        const isMatch = icons.hasOwnProperty(match[1]);
                        if (isMatch) {
                            Icon = icons[match[1] as keyof typeof icons];
                        }
                        // @ts-ignore
                        const metaValue = node?.data?.meta || ''; // Provide a default value if meta doesn't exist
                        return (
                            <div className="bg-graident-dark text-gray-300 border rounded-md">
                                <div className='px-5 py-2 border-b flex items-center justify-between'>
                                    <div className="flex items-center gap-2">
                                        <Icon />
                                        <span>{metaValue}</span>
                                    </div>
                                    <CopyButton id={id}/>
                                </div>
                                <div className='overflow-x-auto w-full'>
                                    <div className='p-5' id={id}>
                                        {children}
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <code className='bg-zinc-700 rounded-md'>
                                {children}
                            </code>
                        )
                    }
                },
            }}>
            {content}
        </Markdown>
    )
}
