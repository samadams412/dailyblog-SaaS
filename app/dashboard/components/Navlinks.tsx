"use client";    
import React from 'react'
import {PersonIcon, ReaderIcon} from '@radix-ui/react-icons'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
export default function Navlinks() {
    const pathname = usePathname();
    const links = [{
        href: "/dashboard",
        text:"Dashboard",
        Icon: ReaderIcon
    },
    {
        href: "/dashboard/user",
        text:"User",
        Icon: PersonIcon
    }
]

    return (
        <div className='flex items-center gap-5 border-b pb-2'>
            {links.map(({href, text, Icon}, index) => {
                return (
                <Link href={href} key={index} className={cn("flex items-center gap-1 hover:underline transition-all", {"text-red-500" : pathname === href})}>
                    <Icon/>/
                    {text}
                </Link>
            )})}
        </div>
    )
}
