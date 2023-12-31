"use client";
import { createBrowserClient } from '@supabase/ssr';
import React, { useEffect } from 'react'
import { useUser } from '../lib/store/user';
export default function sessionProvider() {
    
    const setUser = useUser((state)=>state.setUser)
    
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    //get the session
    const readUserSession = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user);
    }
    useEffect(() => {
        readUserSession();
        // eslint-disable-next-line
    }, []);
    
        return (
        <></>
    )
}
