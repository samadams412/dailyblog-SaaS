import { Button } from '@/components/ui/button'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

import React from 'react'

export default function BlogTable() {
    return (
        <div className='overflow-x-auto'>
            <div className="border bg-graident-dark rounded-md w-[900px] md:w-full">
                {/* table header */}
                <div className='grid grid-cols-5 p-5 text-gray-500 border-b'>
                    <h1 className='col-span-2'>Title</h1>
                    <h1>Premium</h1>
                    <h1>Publish</h1>
                </div>
                {/* table content */}
                <div className="grid grid-cols-5 p-5">
                    <h1 className='col-span-2'>Blog Title</h1>
                    <Switch checked={false}/>
                    <Switch checked={true}/>
                    <Actions/>
                </div>
            </div>
        </div>
    )
}
// View, Delete, Edit button components inside of the BlogTable component:
const Actions = () => {
    return (
        <div className='flex items-center gap-2 flex-wrap'>
            <Button variant="outline" className='flex items-center gap-2'>
                <EyeOpenIcon/>
                View
            </Button>
            <Button variant="outline" className='flex items-center gap-2'>
                <TrashIcon/>
                Delete
            </Button>
            <Button variant="outline" className='flex items-center gap-2'>
                <PencilIcon/>
                Edit
            </Button>
        </div>
    )
}